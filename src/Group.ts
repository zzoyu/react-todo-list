import Task from "./Task";

export default class Group extends Array<Task> {
  constructor(public title: string, tasks: Task[] = []) {
    super(...tasks);
    this.title = title;
  }
  get whereToAddTask(): number {
    const firstDoneIndex = this.findIndex((task) => task.done === true);
    return firstDoneIndex > -1 ? firstDoneIndex : this.length;
  }
}
