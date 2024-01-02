import { WebcastPushConnection } from 'tiktok-live-connector'

function connect(tiktokLiveConnection: WebcastPushConnection) {
  tiktokLiveConnection
    .connect()
    .then(state => {
      console.info(`Connected to roomId ${state.roomId}`)
    })
    .catch(err => {
      console.error('Failed to connect', err)
      // Retry after 1 minute
      setTimeout(() => connect(tiktokLiveConnection), 60000)
    })
}

export default function runChatReader(
  tiktokUsername: string,
  onChatListener: (...args: any[]) => void
): void {
  let tiktokLiveConnection = new WebcastPushConnection(`@${tiktokUsername}`)

  connect(tiktokLiveConnection)

  tiktokLiveConnection.on('chat', onChatListener)
  tiktokLiveConnection.on('error', err => {
    console.error('Error!', err)
  })
}
