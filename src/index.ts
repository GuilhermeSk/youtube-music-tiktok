import runChatReader from './liveChatReader'
import UserRequestService from './services/userRequestService'
import ChatListener from './services/chatListener'
import { configure, EventType, getTikTokLiveCreatorUser } from './utils/configs'
import EventManager from './utils/eventManager'
import QueueWithEvent from './utils/queueWithEvent'
import YoutubeMusicBrowserController from './youtubeMusicBrowserController'
;(async () => {
  await configure()

  const youtubeMusicBrowserController = new YoutubeMusicBrowserController()
  await youtubeMusicBrowserController.initialize()
  const userRequestService: UserRequestService = new UserRequestService(
    new QueueWithEvent<string>(EventType.MUSIC_ADDED)
  )
  const chatListener: ChatListener = new ChatListener(
    userRequestService,
    youtubeMusicBrowserController
  )
  const onChatListener: (data: {
    comment: string
    uniqueId: string
    isModerator: boolean
  }) => void = chatListener.get()

  runChatReader(getTikTokLiveCreatorUser(), onChatListener)

  let executing: boolean = false

  EventManager.getInstance().on('MUSIC_ADDED', async () => {
    if (executing) return
    executing = true
    let music: string | null = null
    do {
      music = userRequestService.getNextMusic()
      if (music) {
        await youtubeMusicBrowserController.addMusic(music)
      }
    } while (music)
    executing = false
  })
})()
