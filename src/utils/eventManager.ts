import { EventEmitter } from 'events'

class EventManager {
  private static instance: EventManager
  private emitter: EventEmitter

  private constructor() {
    this.emitter = new EventEmitter()
  }

  public static getInstance(): EventManager {
    if (!EventManager.instance) {
      EventManager.instance = new EventManager()
    }
    return EventManager.instance
  }

  public on(eventName: string, listener: (...args: any[]) => void): void {
    this.emitter.on(eventName, listener)
  }

  public emit(eventName: string, ...args: any[]): void {
    this.emitter.emit(eventName, ...args)
  }
}

export default EventManager
