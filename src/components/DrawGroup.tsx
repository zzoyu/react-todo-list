import { useState } from "react";
import Group from "../Group";
import DrawTask from "./DrawTask";
import Task from "../Task";
import AddButton from "./AddButton";

interface Props {
  group: Group;
  onGroupChange: (group: Group) => void;
  onTaskDone: (task: Task) => void;
}
const DrawGroup = ({ group, onGroupChange, onTaskDone }: Props) => {
  const [textTitle, setTextTitle] = useState<string>(group.title);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isTaskAdding, setIsTaskAdding] = useState<boolean>(false);

  return (
    <article className="w-40">
      {isEditing ? (
        <input
          className="text-lg mb-2 outline-1 outline w-40 rounded"
          type="text"
          value={textTitle}
          autoFocus={true}
          onChange={(e) => {
            setTextTitle(e.target.value);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setIsEditing(false);
              const tempGroup = new Group(textTitle, [...group]);
              onGroupChange(tempGroup);
            } else if (e.key === "Escape") {
              setIsEditing(false);
              setTextTitle(group.title);
            }
          }}
          onBlur={() => {
            setIsEditing(false);
            const tempGroup = new Group(textTitle, [...group]);
            onGroupChange(tempGroup);
          }}
        />
      ) : (
        <h2
          className="text-lg mb-2"
          onClick={() => {
            setIsEditing(true);
          }}
        >
          {group.title}
        </h2>
      )}

      <div className="flex flex-col gap-1">
        {group.map((task, i) => (
          <DrawTask
            task={task}
            isNew={isTaskAdding && i === group.length - 1}
            onTaskChange={(task: Task) => {
              const tempGroup = new Group(group.title, [...group]);
              tempGroup[i] = task;
              onGroupChange(tempGroup);
              if (task.done === true) onTaskDone(task);
            }}
            key={i}
          />
        ))}
        {
          <AddButton
            onClick={() => {
              setIsTaskAdding(true);
              onGroupChange(
                new Group(group.title, [...group, new Task("New Task")])
              );
            }}
          />
        }
      </div>
    </article>
  );
};

export default DrawGroup;
