import 'dotenv/config'
import readline from 'readline'
import fs from 'fs'
import path from 'path'

// 20 minutes between the same music requests
let TIME_BETWEEN_SAME_MUSIC_REQUESTS = 20 * 60 * 1000

let TIKTOK_LIVE_CREATOR_USER = process.env.TIKTOK_LIVE_CREATOR_USER
const trueRegex = /^true$/i
let DEBUG: boolean = isTrue(process.env.DEBUG)

export function getTikTokLiveCreatorUser(): string {
  return TIKTOK_LIVE_CREATOR_USER || ''
}

export function getTimeBetweenSameMusicRequests(): number {
  return TIME_BETWEEN_SAME_MUSIC_REQUESTS
}

export function isDebug(): boolean {
  return DEBUG
}

export function isTrue(value: string | null | undefined): boolean {
  if (!value) return false
  return trueRegex.test(value)
}

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

function promptForInput(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  return new Promise<string>(resolve => {
    rl.question(question, userInput => {
      rl.close()
      resolve(userInput)
    })
  })
}

export async function configure() {
  if (!process.env.TIKTOK_LIVE_CREATOR_USER) {
    // collect user input from console
    TIKTOK_LIVE_CREATOR_USER = await promptForInput(
      'TikTok Live creator user without @: '
    )
    DEBUG = true

    const envContent = `TIKTOK_LIVE_CREATOR_USER=${TIKTOK_LIVE_CREATOR_USER}\nDEBUG=true`

    // save to .env file
    const envPath = path.join(__dirname, '../../.env')
    fs.writeFile(envPath, envContent, (err: any) => {
      if (err) {
        console.error('Error writing the file:', err)
      } else {
        console.log('File saved successfully!')
      }
    })
  }
}
