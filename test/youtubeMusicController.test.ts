import {
  blockUser,
  cleanup,
  getNextMusic,
  requestMusic
} from '../src/youtubeMusicController'
import { TIME_BETWEEN_SAME_MUSIC_REQUESTS } from '../src/utils/configs'

const fixedTimestamp: number = 1234567890
const defaultUser: string = '@my.user'
const defaultMusic: string = 'Default Music'

describe('youtubeMusicController', () => {
  beforeEach(() => {
    cleanup()
  })
  it('should request music successfully', () => {
    expect(requestMusic(defaultUser, defaultMusic)).toBe(true)
  })
  it('should allow to request the same music after 10 minutes', () => {
    jest.spyOn(global.Date, 'now').mockReturnValue(fixedTimestamp)
    expect(requestMusic(defaultUser, defaultMusic)).toBe(true)
    jest
      .spyOn(global.Date, 'now')
      .mockReturnValue(fixedTimestamp + TIME_BETWEEN_SAME_MUSIC_REQUESTS)
    expect(requestMusic(defaultUser, defaultMusic)).toBe(true)
  })
  it('should fail to request the same music within X minutes', () => {
    jest.spyOn(global.Date, 'now').mockReturnValue(fixedTimestamp)
    expect(requestMusic(defaultUser, defaultMusic)).toBe(true)
    jest
      .spyOn(global.Date, 'now')
      .mockReturnValue(fixedTimestamp + TIME_BETWEEN_SAME_MUSIC_REQUESTS - 1)
    expect(requestMusic(defaultUser, defaultMusic)).toBe(false)
  })
  it('should deny blocked user to request music', () => {
    blockUser(defaultUser)
    expect(requestMusic(defaultUser, defaultMusic)).toBe(false)
  })
  it('should queue requested musics and extract them in order', () => {
    const music1 = 'music1'
    const music2 = 'music2'
    const music3 = 'music3'
    expect(getNextMusic()).toBeNull()
    expect(requestMusic(defaultUser, music1)).toBe(true)
    expect(requestMusic(defaultUser, music2)).toBe(true)
    expect(requestMusic(defaultUser, music3)).toBe(true)
    expect(getNextMusic()).toBe(music1)
    expect(getNextMusic()).toBe(music2)
    expect(getNextMusic()).toBe(music3)
    expect(getNextMusic()).toBeNull()
  })
})
