import { useEffect, useState } from "react";
import Task from "../Task";

interface Props {
  task: Task;
  onTaskChange: (task: Task) => void;
  isNew?: boolean;
}

const DrawTask = ({ task, onTaskChange, isNew }: Props) => {
  const [isEditing, setIsEditing] = useState<boolean>(isNew || false);
  const [textTask, setTextTask] = useState<string>(task.title);

  if (isEditing === true) {
    return (
      <input
        className="text-lg mb-2 outline-1 outline w-40 rounded"
        type="text"
        value={textTask}
        onFocus={(e) => e.target.select()}
        autoFocus={true}
        onChange={(e) => {
          setTextTask(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            setIsEditing(false);
            const tempTask = new Task(textTask);
            onTaskChange(tempTask);
          } else if (e.key === "Escape") {
            setIsEditing(false);
            setTextTask(task.title);
          }
        }}
        onBlur={() => {
          setIsEditing(false);
          const tempTask = new Task(textTask);
          onTaskChange(tempTask);
        }}
      />
    );
  } else
    return (
      <button
        className="flex flex-row justify-between items-center bg-slate-200 rounded p-2"
        onClick={() => {
          const tempTask = new Task(task.title, !task.done);
          onTaskChange(tempTask);
          // task.toggle() && confetti.current?.addParticles?.();
        }}
      >
        <p
          className={
            task.done ? " text-slate-300 line-through" : "text-slate-700"
          }
          onClickCapture={() => {
            !task.done && setIsEditing(true);
          }}
        >
          {task.title}
        </p>
      </button>
    );
};

export default DrawTask;
