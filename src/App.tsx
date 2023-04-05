import { useEffect, useRef, useState } from "react";
import "./App.css";

const plugSVG = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
    />
  </svg>
);

const buttonStyle =
  "flex items-center justify-center bg-slate-500 rounded p-2 opacity-30 hover:opacity-70";

class Task {
  constructor(
    public title: string,
    public done: boolean = false,
    public isEditing: boolean = false
  ) {
    this.title = title;
    this.done = done;
    this.isEditing = isEditing;
  }

  toggle() {
    this.done = !this.done;
  }
}

class Group extends Array<Task> {
  isEditing: boolean;
  constructor(
    public title: string,
    tasks: Task[] = [],
    isEditing: boolean = true
  ) {
    super(...tasks);
    this.title = title;
    this.isEditing = isEditing;
  }
  removeTask(index: number) {
    this.splice(index, 1);
  }
}

function App() {
  const [workingGroup, setWorkingGroup] = useState<Group>(
    new Group("Today", [], false)
  );

  const [groups, setGroup] = useState<Group[]>([
    new Group(
      "Todo",
      [new Task("Get up"), new Task("Brush teeth"), new Task("Eat breakfast")],
      false
    ),
  ]);

  const DrawGroup = (props: { group: Group; index?: number; add: boolean }) => {
    const { group, index, add } = props;
    const [textTitle, setTextTitle] = useState<string>(group.title);

    return (
      <article className="w-40">
        {group.isEditing ? (
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
                group.title = textTitle;
                group.isEditing = false;
                setGroup([...groups]);
              } else if (e.key === "Escape") {
                group.isEditing = false;
                setGroup([...groups]);
              }
            }}
            onBlur={() => {
              group.title = textTitle;
              group.isEditing = false;
              setGroup([...groups]);
            }}
          />
        ) : (
          <h2
            className="text-lg mb-2"
            onDoubleClick={() => {
              group.isEditing = true;
              setGroup([...groups]);
            }}
          >
            {group.title}
          </h2>
        )}

        <div className="flex flex-col gap-1">
          {group.map((task, i) => {
            if (task.isEditing === true) {
              return (
                <input
                  key={`group_${index ?? group.title}_${i}`}
                  className="text-lg mb-2 outline-1 outline w-40 rounded"
                  type="text"
                  value={textTitle}
                  autoFocus={true}
                  onChange={(e) => {
                    setTextTitle(e.target.value);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      task.isEditing = false;
                      task.title = textTitle;
                      setGroup([...groups]);
                    } else if (e.key === "Escape") {
                      task.isEditing = false;
                      setGroup([...groups]);
                    }
                  }}
                  onBlur={() => {
                    task.isEditing = false;
                    task.title = textTitle;
                    setGroup([...groups]);
                  }}
                />
              );
            } else
              return (
                <div
                  key={`group_${index ?? group.title}_${i}`}
                  className="flex flex-row justify-between items-center bg-slate-200 rounded p-2"
                >
                  <p
                    className=" text-slate-700"
                    onDoubleClick={() => {
                      setTextTitle(task.title);
                      task.isEditing = true;
                      setGroup([...groups]);
                    }}
                  >
                    {task.title}
                  </p>
                </div>
              );
          })}
          {add && (
            <button
              className={buttonStyle}
              onClick={() => {
                addNewTask(group);
              }}
            >
              {plugSVG}
            </button>
          )}
        </div>
        {group.length === 0 && add === false && (
          <h2 className="text-3xl">Let's do something.</h2>
        )}
      </article>
    );
  };

  const addNewTask = (targetGroup: Group) => {
    targetGroup.push(new Task("New Task"));
    setGroup([...groups]);
  };

  return (
    <div className="App flex flex-col items-center justify-center">
      <header className="self-center -mt-20 mb-20">
        <h1>
          Get things <span className="line-through text-red-500">done.</span>
        </h1>
      </header>
      <main className="mb-10 flex justify-stretch items-center">
        <DrawGroup group={workingGroup} add={false} />
      </main>
      <main className="flex flex-row gap-4 relative">
        {groups.map((group, index) => (
          <DrawGroup group={group} index={index} key={index} add={true} />
        ))}
        <button
          className={"absolute left-full ml-4 h-full w-10" + buttonStyle}
          onClick={() => {
            setGroup([...groups, new Group("New Group")]);
          }}
        >
          {plugSVG}
        </button>
      </main>
    </div>
  );
}

export default App;
