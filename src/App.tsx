import { useMemo, useRef, useState } from "react";
import Group from "./Group";
import Task from "./Task";

import "./App.css";
import Confetti, { ConfettiRef } from "./components/Confetti";
import AddButton from "./components/AddButton";
import DrawGroup from "./components/DrawGroup";

function App() {
  const [groups, setGroups] = useState<Group[]>([
    new Group("Todo", [
      new Task("Get up"),
      new Task("Brush teeth"),
      new Task("Eat breakfast"),
    ]),
  ]);
  const [focusGroupIndex, setFocusGroupIndex] = useState<number | null>(null);

  const confetti = useRef<ConfettiRef>(null);

  // draw groups

  const addNewTask = (targetGroup: Group) => {
    targetGroup.push(new Task("New task", false));
    setGroups([...groups]);
  };

  return (
    <div className="App flex flex-col items-center justify-center">
      <Confetti ref={confetti} />
      <header className="self-center -mt-20 mb-20">
        <h1>
          Get things <span className="line-through text-red-500">done.</span>
        </h1>
      </header>
      <main className="flex flex-row gap-4 relative">
        {groups.map((group, index) => (
          <DrawGroup
            group={group}
            key={index + 1}
            isNew={focusGroupIndex === index}
            onGroupChange={(group: Group): void => {
              group.sort((a, b) => {
                if (a.done === b.done) return 0;
                if (a.done === true) return 1;
                return -1;
              });
              setGroups(
                groups.map((_, i) => {
                  if (i === index) {
                    if (focusGroupIndex === index) setFocusGroupIndex(null);
                    return group;
                  }
                  return _;
                })
              );
            }}
            onTaskDone={(task: Task): void => {
              confetti.current?.addParticles(task.title);
            }}
          />
        ))}
        <AddButton
          className="absolute left-full ml-4 h-full w-10"
          onClick={() => {
            setFocusGroupIndex(groups.length);
            setGroups([...groups, new Group("New Group")]);
          }}
        />
      </main>
    </div>
  );
}

export default App;
