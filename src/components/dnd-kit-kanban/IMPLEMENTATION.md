# Kanban Board Implementation with dnd-kit

This guide explains step-by-step how to implement a Kanban board with drag-and-drop functionality using `@dnd-kit` and Ant Design components.

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Step 1: Install Dependencies](#step-1-install-dependencies)
4. [Step 2: Set Up Data Structures](#step-2-set-up-data-structures)
5. [Step 3: Create Sortable Items](#step-3-create-sortable-items)
6. [Step 4: Create Droppable Columns](#step-4-create-droppable-columns)
7. [Step 5: Implement Drag Context](#step-5-implement-drag-context)
8. [Step 6: Handle Drag Events](#step-6-handle-drag-events)
9. [Step 7: Add Visual Feedback](#step-7-add-visual-feedback)
10. [Key Concepts](#key-concepts)
11. [Complete Code](#complete-code)

---

## Overview

dnd-kit is a modern, lightweight drag-and-drop library for React. It provides:
- **Accessibility**: Built-in keyboard navigation and screen reader support
- **Performance**: Optimized for smooth animations
- **Flexibility**: Modular architecture with separate packages
- **TypeScript**: Full TypeScript support

Our Kanban board will have:
- Three columns (To Do, In Progress, Done)
- Draggable task items
- Ability to reorder items within columns
- Ability to move items between columns
- Visual placeholders during drag operations

---

## Prerequisites

- React 18+ with TypeScript
- Ant Design (antd) for UI components
- Basic understanding of React hooks

---

## Step 1: Install Dependencies

```bash
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

**Package Breakdown:**
- `@dnd-kit/core`: Core drag-and-drop functionality
- `@dnd-kit/sortable`: Pre-built sortable components
- `@dnd-kit/utilities`: Helper functions (CSS transforms, etc.)

---

## Step 2: Set Up Data Structures

Define TypeScript interfaces for your data:

```typescript
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
```

**Why these structures?**
- Each item needs a unique `id` for dnd-kit to track it
- Columns contain arrays of items
- This structure makes it easy to move items between columns

**Initial Data:**
```typescript
const initialColumns: Column[] = [
  {
    id: 'todo',
    title: 'To Do',
    items: [
      { id: '1', title: 'Task 1', description: 'First task' },
      { id: '2', title: 'Task 2', description: 'Second task' },
    ],
  },
  {
    id: 'in-progress',
    title: 'In Progress',
    items: [
      { id: '3', title: 'Task 3', description: 'Working on this' },
    ],
  },
  {
    id: 'done',
    title: 'Done',
    items: [
      { id: '4', title: 'Task 4', description: 'Completed' },
    ],
  },
];
```

---

## Step 3: Create Sortable Items

Use the `useSortable` hook to make items draggable:

```typescript
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const SortableItem: React.FC<SortableItemProps> = ({ item }) => {
  const {
    attributes,      // HTML attributes for accessibility
    listeners,       // Event handlers for drag
    setNodeRef,      // Ref to attach to DOM element
    transform,       // Transform data for positioning
    transition,     // Transition data for animations
    isDragging,      // Boolean: is this item being dragged?
    isOver,          // Boolean: is something being dragged over this?
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Card>
        {/* Your card content */}
      </Card>
    </div>
  );
};
```

**Key Points:**
- `useSortable({ id })` - Each item must have a unique ID
- `setNodeRef` - Attach to the root element you want to make draggable
- `transform` - Used to position the item during drag
- `CSS.Transform.toString()` - Converts transform object to CSS string
- `isDragging` - Use for visual feedback (opacity, styling)

---

## Step 4: Create Droppable Columns

Use `useDroppable` to make columns accept dropped items:

```typescript
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

const KanbanColumn: React.FC<ColumnProps> = ({ column, items }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  return (
    <Card ref={setNodeRef}>
      <Title>{column.title}</Title>
      <SortableContext 
        items={items.map(item => item.id)} 
        strategy={verticalListSortingStrategy}
      >
        {items.map((item) => (
          <SortableItem key={item.id} item={item} />
        ))}
      </SortableContext>
    </Card>
  );
};
```

**Key Points:**
- `useDroppable({ id })` - Makes the column a drop target
- `SortableContext` - Wraps sortable items, provides context
- `items` prop - Array of item IDs that can be sorted
- `verticalListSortingStrategy` - Handles vertical list sorting logic

---

## Step 5: Implement Drag Context

Wrap everything in `DndContext`:

```typescript
import { DndContext, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';

const Kanban: React.FC = () => {
  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const [activeId, setActiveId] = useState<string | null>(null);

  // Configure sensors (how drag is activated)
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require 8px movement before drag starts
      },
    })
  );

  return (
    <DndContext 
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      {/* Your columns */}
    </DndContext>
  );
};
```

**Sensors Explained:**
- `PointerSensor` - Handles mouse/touch events
- `activationConstraint: { distance: 8 }` - Prevents accidental drags
- Alternative: `KeyboardSensor` for keyboard navigation

---

## Step 6: Handle Drag Events

### 6.1 Drag Start

```typescript
const handleDragStart = (event: DragStartEvent) => {
  setActiveId(event.active.id as string);
};
```

**Purpose:** Track which item is being dragged (for visual feedback)

### 6.2 Drag Over (Optional - for placeholders)

```typescript
const [overId, setOverId] = useState<string | null>(null);

const handleDragOver = (event: DragOverEvent) => {
  const { over } = event;
  if (over) {
    setOverId(over.id as string);
  }
};
```

**Purpose:** Track what's being hovered over (for placeholder indicators)

### 6.3 Drag End (The Main Logic)

```typescript
const handleDragEnd = (event: DragEndEvent) => {
  const { active, over } = event;
  setActiveId(null);
  setOverId(null);

  if (!over) return; // Dropped outside

  const activeId = active.id as string;
  const overId = over.id as string;

  // Find which column contains the dragged item
  const activeColumn = findColumn(activeId);
  if (!activeColumn) return;

  const activeItem = activeColumn.items.find(item => item.id === activeId);
  if (!activeItem) return;

  // Case 1: Dropped on a column (empty area)
  const targetColumn = columns.find(col => col.id === overId);
  if (targetColumn) {
    // Move item to target column
    setColumns(prevColumns => {
      return prevColumns.map(col => {
        if (col.id === activeColumn.id) {
          // Remove from source column
          return {
            ...col,
            items: col.items.filter(item => item.id !== activeId),
          };
        }
        if (col.id === targetColumn.id) {
          // Add to target column
          return {
            ...col,
            items: [...col.items, activeItem],
          };
        }
        return col;
      });
    });
    return;
  }

  // Case 2: Dropped on another item
  const overColumn = findColumn(overId);
  if (!overColumn) return;

  if (activeColumn.id === overColumn.id) {
    // Same column - reorder
    setColumns(prevColumns => {
      return prevColumns.map(col => {
        if (col.id === activeColumn.id) {
          const oldIndex = col.items.findIndex(item => item.id === activeId);
          const newIndex = col.items.findIndex(item => item.id === overId);
          
          const newItems = [...col.items];
          const [removed] = newItems.splice(oldIndex, 1);
          newItems.splice(newIndex, 0, removed);
          
          return { ...col, items: newItems };
        }
        return col;
      });
    });
  } else {
    // Different column - move item
    setColumns(prevColumns => {
      return prevColumns.map(col => {
        if (col.id === activeColumn.id) {
          // Remove from source
          return {
            ...col,
            items: col.items.filter(item => item.id !== activeId),
          };
        }
        if (col.id === overColumn.id) {
          // Insert at target position
          const overIndex = col.items.findIndex(item => item.id === overId);
          const newItems = [...col.items];
          newItems.splice(overIndex, 0, activeItem);
          return { ...col, items: newItems };
        }
        return col;
      });
    });
  }
};
```

**Logic Flow:**
1. Check if dropped on a column → Move to end of that column
2. Check if dropped on an item in same column → Reorder
3. Check if dropped on an item in different column → Move and insert at position

---

## Step 7: Add Visual Feedback

### 7.1 Drag Overlay

Show a preview of the item being dragged:

```typescript
import { DragOverlay } from '@dnd-kit/core';

<DragOverlay>
  {activeItem ? (
    <Card style={{ opacity: 0.8 }}>
      {/* Item preview */}
    </Card>
  ) : null}
</DragOverlay>
```

### 7.2 Placeholder Indicators

Show where the item will be dropped:

```typescript
const SortableItem: React.FC<SortableItemProps> = ({ item, activeId }) => {
  const { isOver, isDragging } = useSortable({ id: item.id });
  
  const showPlaceholder = !isDragging && isOver && activeId && activeId !== item.id;

  return (
    <>
      {showPlaceholder && (
        <div style={{
          height: 10,
          backgroundColor: '#1890ff',
          marginBottom: 6,
        }} />
      )}
      {/* Item content */}
    </>
  );
};
```

### 7.3 Column Highlighting

```typescript
const KanbanColumn: React.FC<ColumnProps> = ({ column }) => {
  const { isOver } = useDroppable({ id: column.id });

  return (
    <Card style={{
      backgroundColor: isOver ? '#e6f7ff' : '#fafafa',
      border: isOver ? '2px dashed red' : '1px solid #d9d9d9',
    }}>
      {/* Column content */}
    </Card>
  );
};
```

---

## Key Concepts

### 1. **IDs are Critical**
- Every draggable item needs a unique ID
- IDs are used to track items during drag operations
- Never reuse IDs or change them during drag

### 2. **Refs Must Be Attached**
- `setNodeRef` from `useSortable` → attach to draggable element
- `setNodeRef` from `useDroppable` → attach to droppable element
- Without refs, drag-and-drop won't work

### 3. **Transform vs Position**
- `transform` is used for smooth animations
- Don't manually position items during drag
- Let dnd-kit handle positioning

### 4. **State Management**
- Keep your data structure in sync with drag operations
- Update state in `onDragEnd`, not during drag
- Use `activeId` for visual feedback only

### 5. **Strategies**
- `verticalListSortingStrategy` - for vertical lists
- `horizontalListSortingStrategy` - for horizontal lists
- Custom strategies can be created for complex layouts

---

## Common Patterns

### Pattern 1: Moving Between Containers

```typescript
// Remove from source
if (col.id === sourceColumn.id) {
  return { ...col, items: col.items.filter(item => item.id !== activeId) };
}
// Add to target
if (col.id === targetColumn.id) {
  return { ...col, items: [...col.items, activeItem] };
}
```

### Pattern 2: Reordering Within Container

```typescript
const oldIndex = items.findIndex(item => item.id === activeId);
const newIndex = items.findIndex(item => item.id === overId);
const newItems = [...items];
const [removed] = newItems.splice(oldIndex, 1);
newItems.splice(newIndex, 0, removed);
```

### Pattern 3: Finding Parent Container

```typescript
const findColumn = (itemId: string): Column | undefined => {
  return columns.find(col => 
    col.items.some(item => item.id === itemId)
  );
};
```

---

## Troubleshooting

### Items Not Dragging
- ✅ Check that `setNodeRef` is attached
- ✅ Verify IDs are unique
- ✅ Ensure `SortableContext` wraps items
- ✅ Check that `listeners` are spread on draggable element

### Items Not Dropping
- ✅ Verify `useDroppable` is used on columns
- ✅ Check that column IDs match in drop logic
- ✅ Ensure `onDragEnd` handler is implemented

### Visual Issues
- ✅ Use `transform` for positioning, not manual styles
- ✅ Check `isDragging` state for opacity changes
- ✅ Verify `DragOverlay` is inside `DndContext`

### Performance Issues
- ✅ Use `activationConstraint` to prevent accidental drags
- ✅ Memoize expensive calculations
- ✅ Consider virtualizing for large lists

---

## Advanced Features

### Keyboard Navigation

```typescript
import { KeyboardSensor } from '@dnd-kit/core';

const sensors = useSensors(
  useSensor(PointerSensor),
  useSensor(KeyboardSensor, {
    coordinateGetter: sortableKeyboardCoordinates,
  })
);
```

### Custom Modifiers

```typescript
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';

<DndContext modifiers={[restrictToVerticalAxis]}>
  {/* ... */}
</DndContext>
```

### Collision Detection

```typescript
import { closestCenter } from '@dnd-kit/core';

<DndContext collisionDetection={closestCenter}>
  {/* ... */}
</DndContext>
```

---

## Best Practices

1. **Always use TypeScript** - dnd-kit has excellent type definitions
2. **Test drag operations** - Especially edge cases (empty columns, single items)
3. **Provide visual feedback** - Users need to see what's happening
4. **Handle edge cases** - What if dropped outside? What if same position?
5. **Optimize re-renders** - Use React.memo for item components if needed
6. **Accessibility** - dnd-kit provides this, but test with screen readers

---

## Resources

- [dnd-kit Documentation](https://docs.dndkit.com/)
- [dnd-kit Examples](https://docs.dndkit.com/examples)
- [Ant Design Components](https://ant.design/components/overview/)

---

## Summary

Implementing a Kanban board with dnd-kit involves:

1. ✅ Setting up data structures with unique IDs
2. ✅ Making items sortable with `useSortable`
3. ✅ Making columns droppable with `useDroppable`
4. ✅ Wrapping in `DndContext` with sensors
5. ✅ Handling drag events to update state
6. ✅ Adding visual feedback for better UX

The key is understanding how dnd-kit tracks items by ID and how to update your state structure when items move between containers.
