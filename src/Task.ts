export default class Task {
  constructor(public title: string, public done: boolean = false) {
    this.title = title;
    this.done = done;
  }

  toggle() {
    this.done = !this.done;
    return this.done;
  }
}
