import 'dotenv/config'

export const EventType = {
  // Music added event
  MUSIC_ADDED: 'MUSIC_ADDED',
  CHAT_COMMAND: 'COMMAND'
}

export enum CommandType {
  PLAY = 'play',
  SKIP = 'skip',
  PAUSE = 'pause',
  RESUME = 'resume',
  INVALID = 'invalid'
}

export function getCommandType(command: string): CommandType {
  switch (command.trim().toLowerCase()) {
    case CommandType.PLAY:
      return CommandType.PLAY
    case CommandType.SKIP:
      return CommandType.SKIP
    case CommandType.PAUSE:
      return CommandType.PAUSE
    case CommandType.RESUME:
      return CommandType.RESUME
    default:
      return CommandType.INVALID
  }
}

// 20 minutes between the same music requests
export const TIME_BETWEEN_SAME_MUSIC_REQUESTS = 20 * 60 * 1000

export const TIKTOK_LIVE_CREATOR_USER = process.env.TIKTOK_LIVE_CREATOR_USER
