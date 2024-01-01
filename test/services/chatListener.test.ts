import ChatListener from '../../src/services/chatListener'
import { CommandType, EventType } from '../../src/utils/configs'
import UserRequestService from '../../src/services/userRequestService'
import QueueWithEvent from '../../src/utils/queueWithEvent'
import YoutubeMusicBrowserController from '../../src/youtubeMusicBrowserController'

const queue: QueueWithEvent<string> = new QueueWithEvent(EventType.MUSIC_ADDED)
const userRequestService: UserRequestService = new UserRequestService(queue)
const youtubeMusicBrowserController = new YoutubeMusicBrowserController()
const chatListener: ChatListener = new ChatListener(
  userRequestService,
  youtubeMusicBrowserController
)
const onChatListener: (data: {
  comment: string
  uniqueId: string
  isModerator: boolean
}) => void = chatListener.get()

const requestMusic = (userRequestService.requestMusic = jest.fn())
const skip = (youtubeMusicBrowserController.skip = jest.fn())
const pause = (youtubeMusicBrowserController.pause = jest.fn())
const resume = (youtubeMusicBrowserController.resume = jest.fn())

const followUserName = 'followerUserName'

function callPlayCommand(
  command: string,
  expectedCommand: string,
  additionalParam?: string
) {
  const comment = additionalParam
    ? `!${command} ${additionalParam}`
    : `!${command}`
  const data = {
    comment,
    uniqueId: followUserName,
    isModerator: true
  }
  onChatListener(data)
  return { expectedCommand }
}

function testPlayCommand(
  command: string,
  expectedCommand: string,
  additionalParam?: string
) {
  callPlayCommand(command, expectedCommand, additionalParam)
}

function testPlay(command: string) {
  const additionalParam = 'song name'
  testPlayCommand(command, CommandType.PLAY, additionalParam)
  expect(requestMusic).toHaveBeenCalledWith(followUserName, additionalParam)
}

function callCommand(commandType: CommandType, isModerator: boolean = true) {
  const comment = `!${commandType}`
  const data = {
    comment,
    uniqueId: followUserName,
    isModerator
  }
  onChatListener(data)
}

describe('chatListener', () => {
  beforeEach(() => {
    requestMusic.mockClear()
    skip.mockClear()
    pause.mockClear()
    resume.mockClear()
  })
  it('should emit play event with song name', () => {
    testPlay(CommandType.PLAY)
  })
  it('should emit play event with song name with uppercase', () => {
    testPlay(CommandType.PLAY.toUpperCase())
  })
  it('should emit play event with song name with lowercase', () => {
    testPlay(CommandType.PLAY.toLowerCase())
  })
  it('should not emit an event with invalid command', () => {
    callPlayCommand('invalidCommand', CommandType.PLAY)
    expect(requestMusic).toHaveBeenCalledTimes(0)
  })
  it('should emit skip event', () => {
    callCommand(CommandType.SKIP)
    expect(skip).toHaveBeenNthCalledWith(1, followUserName, true)
  })
  it('should emit pause event', () => {
    callCommand(CommandType.PAUSE)
    expect(pause).toHaveBeenNthCalledWith(1, followUserName, true)
  })
  it('should emit resume event', () => {
    callCommand(CommandType.RESUME)
    expect(resume).toHaveBeenNthCalledWith(1, followUserName, true)
  })
})
