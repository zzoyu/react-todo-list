import { useEffect, useState } from "react";
import Task from "../Task";

interface Props {
  task: Task;
  onTaskChange: (task: Task) => void;
  isNew: boolean;
}

const DrawTask = ({ task, onTaskChange, isNew }: Props) => {
  const [isEditing, setIsEditing] = useState<boolean>(isNew || false);
  const [textTask, setTextTask] = useState<string>(task.title);

  useEffect(() => {
    console.log("isNew", isNew);
    if (isNew) {
      setIsEditing(true);
    }
  }, [isNew]);

  if (isEditing === true) {
    return (
      <div className="flex flex-row justify-between items-center bg-slate-200 rounded p-2">
        <input
          className="w-full bg-transparent text-slate-700"
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
      </div>
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
        <svg
          className="w-4 h-4 text-slate-700"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            // 24px circle
            d="M12 4a8 8 0 100 16 8 8 0 000-16z"
          />
          {task.done && (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              // draw smaller checkmark inside small circle
              d="M18 8L8.5 15.5 6 12"
            />
          )}
        </svg>
      </button>
    );
};

export default DrawTask;
