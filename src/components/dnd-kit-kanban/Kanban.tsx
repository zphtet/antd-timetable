import React, { useState } from 'react';
import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors, useDroppable } from '@dnd-kit/core';
import type { DragEndEvent, DragOverEvent, DragStartEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, Space, Typography } from 'antd';
import { DragOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface TodoItem {
  id: string;
  title: string;
  description?: string;
}

interface Column {
  id: string;
  title: string;
  items: TodoItem[];
}

const initialColumns: Column[] = [
  {
    id: 'todo',
    title: 'To Do',
    items: [
      { id: '1', title: 'Task 1', description: 'First task to complete' },
      { id: '2', title: 'Task 2', description: 'Second task to complete' },
      { id: '3', title: 'Task 3', description: 'Third task to complete' },
    ],
  },
  {
    id: 'in-progress',
    title: 'In Progress',
    items: [
      { id: '4', title: 'Task 4', description: 'Currently working on this' },
      { id: '5', title: 'Task 5', description: 'Another in-progress task' },
    ],
  },
  {
    id: 'done',
    title: 'Done',
    items: [
      { id: '6', title: 'Task 6', description: 'Completed task' },
    ],
  },
];

interface SortableItemProps {
  item: TodoItem;
  activeId: string | null;
}

const SortableItem: React.FC<SortableItemProps> = ({ item, activeId }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    isOver,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const showPlaceholder = !isDragging && isOver && activeId && activeId !== item.id;

  return (
    <>
      {showPlaceholder && (
        <div
          style={{
            height: 2,
            backgroundColor: '#1890ff',
            marginBottom: 6,
            borderRadius: 1,
          }}
        />
      )}
      <div ref={setNodeRef} style={style} {...attributes}>
        <Card
          size="small"
          style={{
            marginBottom: 8,
            backgroundColor: isDragging ? '#f0f0f0' : '#fff',
          }}
          hoverable
        >
          <Space style={{ width: '100%', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Space direction="vertical" size="small" style={{ flex: 1 }}>
              <Text strong>{item.title}</Text>
              {item.description && <Text type="secondary" style={{ fontSize: 12 }}>{item.description}</Text>}
            </Space>
            <div
              {...listeners}
              style={{
                cursor: 'grab',
                padding: '4px 8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#8c8c8c',
                transition: 'color 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#1890ff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#8c8c8c';
              }}
            >
              <DragOutlined style={{ fontSize: 16 }} />
            </div>
          </Space>
        </Card>
      </div>
    </>
  );
};

interface ColumnProps {
  column: Column;
  items: TodoItem[];
  activeId: string | null;
  overId: string | null;
}

const KanbanColumn: React.FC<ColumnProps> = ({ column, items, activeId, overId }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  const showPlaceholderAtTop = isOver && activeId && !items.some((item) => item.id === overId);

  return (
    <Card
      ref={setNodeRef}
      style={{
        width: 300,
        minHeight: 400,
        backgroundColor: isOver ? '#e6f7ff' : '#fafafa',
        border: isOver ? '2px dashed #1890ff' : '1px solid #d9d9d9',
      }}
      bodyStyle={{ padding: 16 }}
    >
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <Title level={4} style={{ margin: 0 }}>
          {column.title}
        </Title>
        <SortableContext items={items.map((item) => item.id)} strategy={verticalListSortingStrategy}>
          {showPlaceholderAtTop && (
            <div
              style={{
                height: 2,
                backgroundColor: '#1890ff',
                marginBottom: 6,
                borderRadius: 1,
              }}
            />
          )}
          {items.map((item) => (
            <SortableItem key={item.id} item={item} activeId={activeId} />
          ))}
        </SortableContext>
      </Space>
    </Card>
  );
};

const Kanban: React.FC = () => {
  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const findColumn = (id: string): Column | undefined => {
    return columns.find((col) => col.items.some((item) => item.id === id));
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { over } = event;
    if (over) {
      setOverId(over.id as string);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    setOverId(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeColumn = findColumn(activeId);
    if (!activeColumn) return;

    const activeItem = activeColumn.items.find((item) => item.id === activeId);
    if (!activeItem) return;

    // Check if dropped on a column
    const targetColumn = columns.find((col) => col.id === overId);
    
    if (targetColumn) {
      // Dropped on a column
      setColumns((prevColumns) => {
        const newColumns = prevColumns.map((col) => {
          if (col.id === activeColumn.id) {
            return {
              ...col,
              items: col.items.filter((item) => item.id !== activeId),
            };
          }
          if (col.id === targetColumn.id) {
            return {
              ...col,
              items: [...col.items, activeItem],
            };
          }
          return col;
        });
        return newColumns;
      });
      return;
    }

    // Check if dropped on another item
    const overColumn = findColumn(overId);
    if (!overColumn) return;

    if (activeColumn.id === overColumn.id) {
      // Same column - reorder
      setColumns((prevColumns) => {
        const newColumns = prevColumns.map((col) => {
          if (col.id === activeColumn.id) {
            const oldIndex = col.items.findIndex((item) => item.id === activeId);
            const newIndex = col.items.findIndex((item) => item.id === overId);
            
            const newItems = [...col.items];
            const [removed] = newItems.splice(oldIndex, 1);
            newItems.splice(newIndex, 0, removed);
            
            return {
              ...col,
              items: newItems,
            };
          }
          return col;
        });
        return newColumns;
      });
    } else {
      // Different column - move item
      setColumns((prevColumns) => {
        const newColumns = prevColumns.map((col) => {
          if (col.id === activeColumn.id) {
            return {
              ...col,
              items: col.items.filter((item) => item.id !== activeId),
            };
          }
          if (col.id === overColumn.id) {
            const overIndex = col.items.findIndex((item) => item.id === overId);
            const newItems = [...col.items];
            newItems.splice(overIndex, 0, activeItem);
            return {
              ...col,
              items: newItems,
            };
          }
          return col;
        });
        return newColumns;
      });
    }
  };

  const activeItem = activeId
    ? columns
        .flatMap((col) => col.items)
        .find((item) => item.id === activeId)
    : null;

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
      <Space size="large" align="start" style={{ padding: 24 }}>
        {columns.map((column) => (
          <KanbanColumn key={column.id} column={column} items={column.items} activeId={activeId} overId={overId} />
        ))}
      </Space>
      <DragOverlay>
        {activeItem ? (
          <Card
            size="small"
            style={{
              width: 300,
              opacity: 0.8,
            }}
          >
            <Space direction="vertical" size="small" style={{ width: '100%' }}>
              <Text strong>{activeItem.title}</Text>
              {activeItem.description && (
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {activeItem.description}
                </Text>
              )}
            </Space>
          </Card>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default Kanban;
