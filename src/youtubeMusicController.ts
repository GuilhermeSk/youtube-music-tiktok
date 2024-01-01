import QueueWithEvent from './utils/queueWithEvent'
import { MUSIC_ADDED, TIME_BETWEEN_SAME_MUSIC_REQUESTS } from './utils/configs'

const queue = new QueueWithEvent<string>(MUSIC_ADDED)

const blockedUsers: Set<string> = new Set()
const userToMusicRequestMap: Map<string, Map<string, MusicRequest>> = new Map()

class MusicRequest {
  user: string
  music: string
  timestamp: number = Date.now()

  constructor(user: string, music: string) {
    this.user = user
    this.music = music
  }

  allowSameMusic() {
    const time = Date.now() - this.timestamp
    return time >= TIME_BETWEEN_SAME_MUSIC_REQUESTS
  }
}

function addNewMusicRequest(
  user: string,
  music: string,
  userRequestMap: Map<string, MusicRequest>
) {
  const musicRequest = new MusicRequest(user, music)
  userRequestMap.set(music, musicRequest)
  userToMusicRequestMap.set(user, userRequestMap)
  queue.enqueue(music)
}

export function requestMusic(user: string, music: string) {
  if (blockedUsers.has(user)) {
    return false
  }
  const userRequestMap: Map<string, MusicRequest> =
    userToMusicRequestMap.get(user) || new Map<string, MusicRequest>()
  const musicRequest = userRequestMap.get(music)
  if (musicRequest) {
    if (musicRequest.allowSameMusic()) {
      addNewMusicRequest(user, music, userRequestMap)
      return true
    }
    return false
  }
  addNewMusicRequest(user, music, userRequestMap)
  return true
}

export function blockUser(user: string): boolean {
  blockedUsers.add(user)
  return true
}

export function getNextMusic() {
  return queue.dequeue()
}

export function cleanup() {
  blockedUsers.clear()
  userToMusicRequestMap.clear()
  queue.cleanup()
}
