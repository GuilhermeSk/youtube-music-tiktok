import QueueWithEvent from '../utils/queueWithEvent'
import { TIME_BETWEEN_SAME_MUSIC_REQUESTS } from '../utils/configs'

const blockedUsers: Set<string> = new Set()
const userToMusicRequestMap: Map<string, Map<string, MusicRequest>> = new Map()

class MusicRequest {
  timestamp: number = Date.now()

  constructor(
    private user: string,
    private music: string
  ) {}

  allowSameMusic() {
    const time = Date.now() - this.timestamp
    return time >= TIME_BETWEEN_SAME_MUSIC_REQUESTS
  }
}

export default class UserRequestService {
  constructor(private queue: QueueWithEvent<string>) {}

  requestMusic(user: string, music: string): boolean {
    if (blockedUsers.has(user)) {
      return false
    }
    const userRequestMap: Map<string, MusicRequest> =
      userToMusicRequestMap.get(user) || new Map<string, MusicRequest>()
    const musicRequest = userRequestMap.get(music)
    if (musicRequest) {
      if (musicRequest.allowSameMusic()) {
        this.addNewMusicRequest(user, music, userRequestMap)
        return true
      }
      return false
    }
    this.addNewMusicRequest(user, music, userRequestMap)
    return true
  }

  private addNewMusicRequest(
    user: string,
    music: string,
    userRequestMap: Map<string, MusicRequest>
  ) {
    const musicRequest = new MusicRequest(user, music)
    userRequestMap.set(music, musicRequest)
    userToMusicRequestMap.set(user, userRequestMap)
    this.queue.enqueue(music)
  }

  blockUser(user: string): boolean {
    blockedUsers.add(user)
    return true
  }

  getNextMusic(): string | null {
    return this.queue.dequeue()
  }

  cleanup(): void {
    blockedUsers.clear()
    userToMusicRequestMap.clear()
    this.queue.cleanup()
  }
}
