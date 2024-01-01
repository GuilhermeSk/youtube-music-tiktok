import { EventType } from '../../src/utils/configs'
import QueueWithEvent from '../../src/utils/queueWithEvent'
import EventManager from '../../src/utils/eventManager'

const queue = new QueueWithEvent<string>(EventType.MUSIC_ADDED)

describe('QueueWithEvent', () => {
  beforeEach(() => {
    queue.cleanup()
  })
  it('should emit the MUSIC_ADDED', () => {
    const mockListener = jest.fn()
    EventManager.getInstance().on(EventType.MUSIC_ADDED, mockListener)
    queue.enqueue('Hello')
    queue.enqueue('World')
    expect(mockListener).toHaveBeenCalledTimes(2)
  })
  it('should add and get items from queue correctly', () => {
    const queue = new QueueWithEvent<string>(EventType.MUSIC_ADDED)
    const value1: string = 'Hello'
    const value2: string = 'Hello'
    expect(queue.dequeue()).toBeNull()
    queue.enqueue(value1)
    queue.enqueue(value2)
    expect(queue.dequeue()).toBe(value1)
    expect(queue.dequeue()).toBe(value2)
    expect(queue.dequeue()).toBeNull()
  })
})
