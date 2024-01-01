import EventEmitter from 'events'
import EventManager from './eventManager'

const eventEmitter = new EventEmitter()

class QueueWithEvent<T> {
  private queue: T[]
  private readonly eventName: string

  constructor(eventName: string) {
    this.queue = []
    this.eventName = eventName
  }

  enqueue(item: T): void {
    this.queue.push(item)
    EventManager.getInstance().emit(this.eventName)
  }

  dequeue(): T | null {
    if (this.queue.length > 0) {
      return this.queue.shift() as T
    }
    return null
  }

  cleanup() {
    this.queue = []
  }
}

export default QueueWithEvent
