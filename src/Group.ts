import Task from "./Task";

export default class Group extends Array<Task> {
  constructor(public title: string, tasks: Task[] = []) {
    super(...tasks);
    this.title = title;
  }
}
