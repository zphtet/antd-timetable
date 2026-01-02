import { Drawer } from "antd";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { useEffect, useRef, useState } from "react";

interface FlowDrawerProps {
  open: boolean;
  onClose: () => void;
  items: { key: string; label: string }[];
  draggingItemRef: React.MutableRefObject<{ key: string; label: string } | null>;
  onItemDragOutside: (item: { key: string; label: string }, position: { x: number; y: number }) => void;
}

const FlowDrawer = ({ open, onClose, items, draggingItemRef, onItemDragOutside }: FlowDrawerProps) => {
  const drawerRef = useRef<HTMLDivElement>(null);
  const [isOutsideDrawer, setIsOutsideDrawer] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!draggingItemRef.current) return;
      const drawerRect = drawerRef.current?.getBoundingClientRect();
      if (!drawerRect) return;

      const isOutside =
        e.clientX < drawerRect.left ||
        e.clientX > drawerRect.right ||
        e.clientY < drawerRect.top ||
        e.clientY > drawerRect.bottom;

      setIsOutsideDrawer(isOutside);
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (!draggingItemRef.current) return;
      const drawerRect = drawerRef.current?.getBoundingClientRect();
      if (!drawerRect) return;

      if (
        e.clientX < drawerRect.left ||
        e.clientX > drawerRect.right ||
        e.clientY < drawerRect.top ||
        e.clientY > drawerRect.bottom
      ) {
        console.log("Dropped outside drawer:", draggingItemRef.current.label);
        onItemDragOutside(draggingItemRef.current, { x: e.clientX, y: e.clientY });
      }
      draggingItemRef.current = null;
      setIsOutsideDrawer(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [draggingItemRef, onItemDragOutside]);

  return (
    <Drawer title="Flow Drawer" open={open} placement="left" onClose={onClose}>
      <Droppable droppableId="all-items" direction="vertical" isDropDisabled={false} isCombineEnabled={false} ignoreContainerClipping={false}>
        {(provided) => (
          <div
            ref={(ref) => {
              provided.innerRef(ref);
              drawerRef.current = ref!;
            }}
            {...provided.droppableProps}
            style={{
               background :"red",
            }}
          >
            {items.map((item, index) => (
              <Draggable key={item.key} draggableId={item.key} index={index}>
                {(provided, snapshot) => {
                  const isDraggingOutside = snapshot.isDragging && isOutsideDrawer;
                  
                  return (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{
                        ...provided.draggableProps.style,
                        marginBottom: 8,
                        padding: "8px 12px",
                        background: isDraggingOutside ? "#4CAF50" : "#fff",
                        border: isDraggingOutside ? "2px solid #2E7D32" : "1px solid #ccc",
                        borderRadius: 6,
                        cursor: snapshot.isDragging ? "grabbing" : "grab",
                        boxShadow: isDraggingOutside 
                          ? "0 8px 24px rgba(76, 175, 80, 0.4)" 
                          : snapshot.isDragging 
                          ? "0 4px 12px rgba(0,0,0,0.15)" 
                          : "none",
                        color: isDraggingOutside ? "#fff" : "#000",
                        fontWeight: isDraggingOutside ? "bold" : "normal",
                        transform: isDraggingOutside 
                          ? `${provided.draggableProps.style?.transform || ''} scale(1.05)` 
                          : provided.draggableProps.style?.transform,
                      }}
                    >
                      {item.label}
                    </div>
                  );
                }}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </Drawer>
  );
};

export default FlowDrawer;