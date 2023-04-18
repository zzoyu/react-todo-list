export default class Task {
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
    return this.done;
  }
}
