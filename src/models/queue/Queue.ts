export class Queue<T> {
  private items: { [key: number]: T } = {};
  private frontIndex: number = 0;
  private rearIndex: number = 0;

  enqueue(item: T): void {
    this.items[this.rearIndex++] = item;
  }

  dequeue(): T | undefined {
    if (this.isEmpty()) {
      return undefined;
    }
    const item = this.items[this.frontIndex];
    delete this.items[this.frontIndex++];
 
    if (this.isEmpty()) {
      this.frontIndex = 0;
      this.rearIndex = 0;
    }

    return item;
  }

  front(): T | undefined {
    if (this.isEmpty()) {
      return undefined;
    }
    return this.items[this.frontIndex];
  }

  size(): number {
    return this.rearIndex - this.frontIndex;
  }

  isEmpty(): boolean {
    return this.rearIndex === this.frontIndex;
  }
}
