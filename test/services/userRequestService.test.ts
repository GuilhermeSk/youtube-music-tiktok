import UserRequestService from '../../src/services/userRequestService'
import {
  EventType,
  TIME_BETWEEN_SAME_MUSIC_REQUESTS
} from '../../src/utils/configs'
import QueueWithEvent from '../../src/utils/queueWithEvent'

const fixedTimestamp: number = 1234567890
const defaultUser: string = '@my.user'
const defaultMusic: string = 'Default Music'

const queue: QueueWithEvent<string> = new QueueWithEvent(EventType.MUSIC_ADDED)
const userRequestService = new UserRequestService(queue)

describe('userRequestService', () => {
  beforeEach(() => {
    userRequestService.cleanup()
  })
  it('should request music successfully', () => {
    expect(userRequestService.requestMusic(defaultUser, defaultMusic)).toBe(
      true
    )
  })
  it('should allow to request the same music after 10 minutes', () => {
    jest.spyOn(global.Date, 'now').mockReturnValue(fixedTimestamp)
    expect(userRequestService.requestMusic(defaultUser, defaultMusic)).toBe(
      true
    )
    jest
      .spyOn(global.Date, 'now')
      .mockReturnValue(fixedTimestamp + TIME_BETWEEN_SAME_MUSIC_REQUESTS)
    expect(userRequestService.requestMusic(defaultUser, defaultMusic)).toBe(
      true
    )
  })
  it('should fail to request the same music within X minutes', () => {
    jest.spyOn(global.Date, 'now').mockReturnValue(fixedTimestamp)
    expect(userRequestService.requestMusic(defaultUser, defaultMusic)).toBe(
      true
    )
    jest
      .spyOn(global.Date, 'now')
      .mockReturnValue(fixedTimestamp + TIME_BETWEEN_SAME_MUSIC_REQUESTS - 1)
    expect(userRequestService.requestMusic(defaultUser, defaultMusic)).toBe(
      false
    )
  })
  it('should deny blocked user to request music', () => {
    userRequestService.blockUser(defaultUser)
    expect(userRequestService.requestMusic(defaultUser, defaultMusic)).toBe(
      false
    )
  })
  it('should queue requested musics and extract them in order', () => {
    const music1 = 'music1'
    const music2 = 'music2'
    const music3 = 'music3'
    expect(userRequestService.getNextMusic()).toBeNull()
    expect(userRequestService.requestMusic(defaultUser, music1)).toBe(true)
    expect(userRequestService.requestMusic(defaultUser, music2)).toBe(true)
    expect(userRequestService.requestMusic(defaultUser, music3)).toBe(true)
    expect(userRequestService.getNextMusic()).toBe(music1)
    expect(userRequestService.getNextMusic()).toBe(music2)
    expect(userRequestService.getNextMusic()).toBe(music3)
    expect(userRequestService.getNextMusic()).toBeNull()
  })
})
