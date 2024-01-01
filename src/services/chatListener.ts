import UserRequestService from './userRequestService'
import { CommandType, getCommandType } from '../utils/configs'
import YoutubeMusicBrowserController from '../youtubeMusicBrowserController'

const regexPattern = /^!\s*(play)\s+(.+)|skip|pause|resume$/i

export default class ChatListener {
  constructor(
    private userRequestService: UserRequestService,
    private youtubeMusicBrowserController: YoutubeMusicBrowserController
  ) {}

  get() {
    return (data: {
      uniqueId: string
      comment: string
      isModerator: boolean
    }) => {
      console.log(`${data.uniqueId}: '${data.comment}'`)
      if (!data.comment) return
      let match = data.comment.match(regexPattern)
      if (match) {
        const commandType: CommandType = getCommandType(match[1] || match[0])
        const additionalParam = match[2] || ''
        switch (commandType) {
          case CommandType.PLAY:
            this.userRequestService.requestMusic(data.uniqueId, additionalParam)
            break
          case CommandType.SKIP:
            this.youtubeMusicBrowserController.skip(
              data.uniqueId,
              data.isModerator
            )
            break
          case CommandType.PAUSE:
            this.youtubeMusicBrowserController.pause(
              data.uniqueId,
              data.isModerator
            )
            break
          case CommandType.RESUME:
            this.youtubeMusicBrowserController.resume(
              data.uniqueId,
              data.isModerator
            )
            break
        }
      }
    }
  }
}
