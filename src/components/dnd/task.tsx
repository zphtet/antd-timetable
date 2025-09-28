import { Draggable } from "react-beautiful-dnd";

interface TaskProps {
  task: {
    id: string;
    content: string;
  };
  index: number;
}

const Task = ({ task, index }: TaskProps) => {
     // console.log("task data", task);
  return (
    <Draggable draggableId={task.id} isDragDisabled={false} index={index}>
      {(provided) => {
        return (
          <div
             key={task.id}
            ref={provided.innerRef}
            {...provided.draggableProps}
         
             {...provided.dragHandleProps}
             className="task"
          >
            <p>{task.content}</p>
          </div>
        );
      }}
    </Draggable>
  );
};

export default Task;
