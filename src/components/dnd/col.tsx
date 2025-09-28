
import { Draggable, Droppable } from "react-beautiful-dnd";
import Task from "./task";
interface ColumnProps {
  column: {
    id: string;
    title: string;
    taskIds: string[];
  };
  relatedTasks: Array<{
    id: string;
    content: string;
  }>;
  index: number;
}

const Column = ({column, relatedTasks, index}: ColumnProps)=>{
    return <Draggable draggableId={column.id} index={index}>
     {
           (provided)=>{
               return <div ref={provided.innerRef} {...provided.draggableProps}  className="column">    
               <p  {...provided.dragHandleProps} className="column-title">{column.title}</p>
                <Droppable 
                  droppableId={column.id} 
                  isDropDisabled={false} 
                  isCombineEnabled={false} 
                  ignoreContainerClipping={false}
                  direction="vertical"
                  type='task'
                >
                  {
                       (provided)=>{
                          return <div ref={provided.innerRef} {...provided.droppableProps} style={{
                               display : "flex" , flexDirection : "column" , gap : 10 
                          }}>
                               {
                                  relatedTasks.map((task, idx)=>{
                                      return <Task key={task.id} task={task} index={idx} />
                                  })
                               }
                               {provided.placeholder}
                          </div>
                       }
                  }
                </Droppable>
          </div>
           }
     }
    </Draggable>
}

export default Column;