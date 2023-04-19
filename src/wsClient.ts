import WebSocket from 'ws'
import { AuthenticationError } from './error'

export class WsClient {
  ws: WebSocket

  constructor(
    type: 'public' | 'private',
    jwt?: string | null,
    option: 'mainnet' | 'testnet' = 'testnet',
  ) {
    let connection = ''
    const baseUrl =
      option === 'testnet' ? 'wss://api-testnet.brine.fi' : 'wss://api.trade.fi'
    if (type === 'public') connection = `${baseUrl}/public`
    else {
      if (!jwt)
        throw new AuthenticationError(
          'JWT access token must be provided for private connections',
        )
      connection = `${baseUrl}/private?auth_header=${jwt}`
    }
    this.ws = new WebSocket(connection)
  }

  async connect(): Promise<void> {
    while (this.ws.readyState === 0) {
      await this.sleep(500)
    }
  }

  async disconnect(): Promise<void> {
    this.ws.close()
  }

  async sleep(ms: number): Promise<unknown> {
    return new Promise((resolve) => {
      setTimeout(resolve, ms)
    })
  }

  async subscribe(streams: string[]): Promise<void> {
    const msg = {
      event: 'subscribe',
      streams,
    }

    this.ws.send(JSON.stringify(msg))
  }

  async unsubscribe(streams: string[]): Promise<void> {
    const msg = {
      event: 'unsubscribe',
      streams,
    }

    this.ws.send(JSON.stringify(msg))
  }
}
