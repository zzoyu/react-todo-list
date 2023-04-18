import Task from "./Task";

export default class Group extends Array<Task> {
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
