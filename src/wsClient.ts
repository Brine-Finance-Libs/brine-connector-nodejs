import WebSocket from 'ws'
import { AuthenticationError } from './error'

export class WsClient {
  ws: WebSocket

  constructor(
    type: 'public' | 'private',
    jwt?: string | null,
    baseUrl?: string,
  ) {
    let connection = ''
    if (type === 'public')
      connection = `${baseUrl ?? 'wss://api-testnet.brine.fi'}/public`
    else {
      if (!jwt)
        throw new AuthenticationError(
          'JWT access token must be provided for private connections',
        )
      connection = `${
        baseUrl ?? 'wss://api-testnet.brine.fi'
      }/private?auth_header=${jwt}`
    }
    this.ws = new WebSocket(connection)
  }

  async connect() {
    while (this.ws.readyState === 0) {
      await this.sleep(500)
    }
  }

  async disconnect() {
    this.ws.close()
  }

  async sleep(ms: number) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms)
    })
  }

  async subscribe(streams: string[]) {
    const msg = {
      event: 'subscribe',
      streams,
    }

    this.ws.send(JSON.stringify(msg))
  }

  async unsubscribe(streams: string[]) {
    const msg = {
      event: 'unsubscribe',
      streams,
    }

    this.ws.send(JSON.stringify(msg))
  }
}
