import { useState } from "react";
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

class Task {
  constructor(public title: string, public done: boolean = false) {
    this.title = title;
    this.done = done;
  }
  modify(title: string) {
    this.title = title;
  }

  toggle() {
    this.done = !this.done;
  }
}

class Group extends Array<Task> {
  constructor(public title: string, tasks: Task[] = []) {
    super(...tasks);
    this.title = title;
  }
  removeTask(index: number) {
    this.splice(index, 1);
  }
}

function showConffetti() {
  return (
    <div className="absolute top-0 left-0 w-full h-full">
      <canvas
        id="canvas"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 9999,
        }}
      ></canvas>
    </div>
  );
}

function App() {
  const [workingGroup, setWorkingGroup] = useState<Group>(new Group("Today"));

  const [groups, setGroup] = useState<Group[]>([
    new Group("1", [
      new Task("Get up"),
      new Task("Brush teeth"),
      new Task("Eat breakfast"),
    ]),

    new Group("2", [
      new Task("Get up"),
      new Task("Brush teeth"),
      new Task("Eat breakfast"),
    ]),
    new Group("3", [
      new Task("Get up"),
      new Task("Brush teeth"),
      new Task("Eat breakfast"),
    ]),
  ]);

  const DrawGroup = (props: { group: Group; index?: number }) => {
    const { group, index } = props;
    return (
      <article className=" w-40">
        <h2 className="text-lg mb-2">{group.title}</h2>
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
          <button className="flex items-center justify-center bg-slate-500 rounded p-2 opacity-30 hover:opacity-70">
            {plugSVG}
          </button>
        </div>
      </article>
    );
  };

  return (
    <div className="App flex flex-col items-center justify-center">
      <header className="self-center -mt-20 mb-20">
        <h1>
          Get things <span className="line-through text-red-500">done.</span>
        </h1>
      </header>
      <main className="mb-10 flex justify-stretch items-center">
        <DrawGroup group={workingGroup} />
      </main>
      <main className="flex flex-row gap-4 relative">
        {groups.map((group, index) => (
          <DrawGroup group={group} index={index} key={index} />
        ))}
        <button
          className="absolute left-full ml-4 h-full flex flex-col justify-center items-center bg-slate-500 rounded p-2 opacity-30 hover:opacity-70"
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
