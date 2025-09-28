import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import type { DropResult } from 'react-beautiful-dnd';
import Column from './col';
import './style.css';
import { useState } from 'react';
interface Task {
  id: string;
  content: string;
}

interface Column {
  id: string;
  title: string;
  taskIds: string[];
}

interface Data {
  tasks: Record<string, Task>;
  columns: Record<string, Column>;
  columnOrder: string[];
}

const initialData: Data = {
    tasks : {
        'task-1' : {id : 'task-1', content : '1 Take out the garbage'},
        'task-2' : {id : 'task-2', content : '2 Watch my favorite show'},
        'task-3' : {id : 'task-3', content : '3 Charge my phone'},
        'task-4' : {id : 'task-4', content : '4 Cook dinner'},
        'task-5' : {id : 'task-5', content : '5 Wash the dishes'},
        'task-6' : {id : 'task-6', content : '6 Clean the house'},
        'task-7' : {id : 'task-7', content : '7 Mow the lawn'},
        'task-8' : {id : 'task-8', content : '8 Fix the car'},
        'task-9' : {id : 'task-9', content : '9 Buy the groceries'},
        'task-10' : {id : 'task-10', content : '10 Do the laundry'},
    },
     columns : {
          'column-1' : {
            id : 'column-1',
            title : "Column one",
            taskIds : ['task-1', 'task-2', 'task-3', 'task-4'],
          },
          'column-2' : {
            id : 'column-2',
            title : "Column two",
            taskIds : ['task-5', 'task-6', 'task-7'],
          },
          'column-3' : {
            id : 'column-3',
            title : "Column three",
            taskIds : ['task-8', 'task-9', 'task-10'],
          },
     }, 

     columnOrder : ['column-1', 'column-2', 'column-3'],
        
}
function swap<T>(arr: T[], index1: number, index2: number): T[] {
  // clone array to avoid mutating original
  const newArr = [...arr];

  // check bounds
  if (
    index1 < 0 || index1 >= newArr.length ||
    index2 < 0 || index2 >= newArr.length
  ) {
    throw new Error("Index out of bounds");
  }

  // swap
  [newArr[index1], newArr[index2]] = [newArr[index2], newArr[index1]];

  return newArr;
}

function removeAt<T>(arr: T[], index: number): T[] {
  if (index < 0 || index >= arr.length) {
    throw new Error("Index out of bounds");
  }
  return [...arr.slice(0, index), ...arr.slice(index + 1)];
}

function insertAt<T>(arr: T[], index: number, item: T): T[] {
  if (index < 0 || index > arr.length) {
    throw new Error("Index out of bounds");
  }
  return [...arr.slice(0, index), item, ...arr.slice(index)];
}
const Dnd = ()=>{
  const [data, setData] = useState(initialData);
    const onDragEnd = (result: DropResult) => {
        // For now, just log the result - you can implement the actual logic later
        console.log('Drag ended:', result);
        if(result.type === 'column'){
           console.log("type is column")

           const currentColumnOrder= data?.columnOrder;
           const modifiedColumnOrder = swap(currentColumnOrder, result.source.index, result.destination?.index ?? 0);

           setData({
            ...data,
            columnOrder : modifiedColumnOrder,
           })
          return;
        }

        const sourceDroppableId = result?.source?.droppableId;
        const destinationDroppableId = result?.destination?.droppableId;

        if(!destinationDroppableId) return;

        if(destinationDroppableId === sourceDroppableId){
           const taskIds = data?.columns[sourceDroppableId]?.taskIds;
           const modifiedTaskIds = swap(taskIds, result.source.index, result.destination?.index ?? 0);

           setData({
            ...data,
            columns : {
              ...data.columns,
              [result.source?.droppableId] : {
                ...data.columns[result.source?.droppableId],
                taskIds : modifiedTaskIds,
              }
            }
           })
        }

        if(destinationDroppableId !== sourceDroppableId){
           const sourceTaskIds = data?.columns[sourceDroppableId]?.taskIds;
           const destinationTaskIds = data?.columns?.[destinationDroppableId!]?.taskIds;
           
            const sourceItemId = sourceTaskIds?.[result.source.index]

            const modifiedSourceTaskIdx = removeAt(sourceTaskIds, result.source.index);

            const modifiedDestinationTaskIdx = insertAt(destinationTaskIds, result.destination?.index ?? 0, sourceItemId);
           setData({
            ...data,
            columns : {
              ...data.columns,
              [sourceDroppableId] : {
                ...data.columns[sourceDroppableId],
                taskIds : modifiedSourceTaskIdx,
              },
              [destinationDroppableId!] : {
                ...data.columns?.[destinationDroppableId!],
                taskIds : modifiedDestinationTaskIdx,
              }
            }
           })
        }

    };

    return  <DragDropContext onDragEnd={onDragEnd} key="dnd-context">
               <Droppable droppableId="all-columns" direction="horizontal" type='column' isDropDisabled={false} isCombineEnabled={false} ignoreContainerClipping={false}>
               {
                  (provided)=>{

                  return <div ref={provided.innerRef} {...provided.droppableProps} style={{ display: 'flex', gap: '20px', padding: '20px' }}>
                    {
                      data.columnOrder.map((columnId , index)=>{
                            const column = data.columns[columnId];
                            const relatedTasks = column.taskIds.map((taskId: string) => data.tasks[taskId]);
   
                            return <Column key={columnId} column={column} index={index} relatedTasks={relatedTasks} />
                      })
                     
                    }
                     {provided.placeholder}
                  </div>
                  }
               }
               </Droppable>
            </DragDropContext>
}

export default Dnd;