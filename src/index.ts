// import { addMusic } from './browserInterface'
import runChatReader from './liveChatReader'
import UserRequestService from './services/userRequestService'
import ChatListener from './services/chatListener'
import { EventType, TIKTOK_LIVE_CREATOR_USER } from './utils/configs'
import EventManager from './utils/eventManager'
import QueueWithEvent from './utils/queueWithEvent'
import YoutubeMusicBrowserController from './youtubeMusicBrowserController'

const youtubeMusicBrowserController = new YoutubeMusicBrowserController()
youtubeMusicBrowserController.initialize()
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

if (TIKTOK_LIVE_CREATOR_USER) {
  runChatReader(TIKTOK_LIVE_CREATOR_USER, onChatListener)
} else {
  console.error(
    'TIKTOK_LIVE_CREATOR_USER is not defined. Please edit .env file'
  )
  process.exit(1)
}

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
