import { WebcastPushConnection } from 'tiktok-live-connector'

export default function runChatReader(
  tiktokUsername: string,
  onChatListener: (...args: any[]) => void
): void {
  let tiktokLiveConnection = new WebcastPushConnection(`@${tiktokUsername}`)

  tiktokLiveConnection
    .connect()
    .then(state => {
      console.info(`Connected to roomId ${state.roomId}`)
    })
    .catch(err => {
      console.error('Failed to connect', err)
    })

  tiktokLiveConnection.on('chat', onChatListener)
  tiktokLiveConnection.on('error', err => {
    console.error('Error!', err)
  })
}
