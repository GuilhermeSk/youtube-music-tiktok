import runChatReader from './liveChatReader'
import UserRequestService from './services/userRequestService'
import ChatListener from './services/chatListener'
import { configure, EventType, getTikTokLiveCreatorUser } from './utils/configs'
import EventManager from './utils/eventManager'
import QueueWithEvent from './utils/queueWithEvent'
import YoutubeMusicBrowserController from './youtubeMusicBrowserController'
import { isTrue, promptForInput } from './utils/utils'
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

  if (isTrue(process.env.TEST_ENV)) {
    simulateUserInputs(onChatListener).then(() => {
      console.log('Done')
    })
  } else {
    runChatReader(getTikTokLiveCreatorUser(), onChatListener)
  }

  // read music requests from queue and add them to the browser
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

async function simulateUserInputs(
  onChatListener: (data: {
    comment: string
    uniqueId: string
    isModerator: boolean
  }) => void
) {
  while (true) {
    const message = await promptForInput(
      'Enter a message to test the chat listener: '
    )
    onChatListener({
      comment: message,
      uniqueId: 'follower',
      isModerator: true
    })
  }
}
