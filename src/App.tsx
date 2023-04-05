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
  modify(title: string) {
    this.title = title;
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
    const titleInput = useRef<HTMLInputElement>(null);

    useEffect(() => {
      titleInput.current?.focus();
    });

    return (
      <article className="w-40">
        {group.isEditing ? (
          <input
            className="text-lg mb-2 outline-1 outline w-40 rounded"
            type="text"
            value={textTitle}
            ref={titleInput}
            onChange={(e) => {
              setTextTitle(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                group.title = textTitle;
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
          {group.map((task, i) => (
            <div
              key={`group_${index ?? group.title}_${i}`}
              className="flex flex-row justify-between items-center bg-slate-200 rounded p-2"
              onClick={() => task.toggle()}
            >
              <p className=" text-slate-700">{task.title}</p>
            </div>
          ))}
          {add && <button className={buttonStyle}>{plugSVG}</button>}
        </div>
        {group.length === 0 && add === false && (
          <h2 className="text-3xl">Let's do something.</h2>
        )}
      </article>
    );
  };

  const toggleTask = (index: number) => {
    workingGroup[index].toggle();
    setWorkingGroup(workingGroup);
  };

  const addNewTask = (task: Task) => {
    workingGroup.push(task);
    setWorkingGroup(workingGroup);
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
          className={buttonStyle}
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
