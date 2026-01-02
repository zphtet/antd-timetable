import { useRef, useState } from "react";
import { DragDropContext, type DropResult, type DragStart } from "react-beautiful-dnd";
import FlowDrawer from "./FlowDrawer.tsx";
import Canvas from "./Canvas.tsx";

const initialItems = [
  { key: "1", label: "Item 1" },
  { key: "2", label: "Item 2" },
  { key: "3", label: "Item 3" },
  { key: "4", label: "Item 4" },
];

const DrawerFlow = () => {
  const [open, setOpen] = useState(false);
  const draggingItemRef = useRef<{ key: string; label: string } | null>(null);
  // const canvasRef = useRef<unknown>(null);

  const [items , setItems] = useState(initialItems);

  const handleDragStart = (start: DragStart) => {
    const dragged = items.find((i) => i.key === start.draggableId);
    if (dragged) {
      draggingItemRef.current = dragged;
      console.log("RBD Drag started:", dragged.label);
    }
  };

  const onDragEnd = (result: DropResult) => {
    console.log("Drawer reorder:", result);
  };

 
  const handleItemDragOutside = (item: { key: string; label: string }, position: { x: number; y: number }) => {
    console.log("Dropped outside drawer:", item.label, position);
    setItems(prev=>{
      return [  {key : `item-${prev.length + 1}` , label : `Item ${prev.length + 1}`},...prev ]
    })
  
  };

  return (
    <DragDropContext onDragStart={handleDragStart} onDragEnd={onDragEnd} >
      <div style={{ position: "relative" }}>
        <FlowDrawer
          open={open}
          onClose={() => setOpen(false)}
          items={items}
          draggingItemRef={draggingItemRef}
          onItemDragOutside={handleItemDragOutside}
        />
        <Canvas items={items} />
        <button
          onClick={() => setOpen(true)}
          style={{ position: "absolute", top: 0, right: 0 }}
        >
          Open Drawer
        </button>
      </div>
    </DragDropContext>
  );
};

export default DrawerFlow;