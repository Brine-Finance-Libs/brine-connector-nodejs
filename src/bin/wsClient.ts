import WebSocket from 'ws'

export class WsClient {
  ws: WebSocket

  constructor(type: 'public' | 'private', jwt?: string) {
    let connection = ''
    if (type === 'public') connection = 'wss://api-testnet.brine.fi/public'
    else {
      if (!jwt)
        throw 'JWT access token must be provided for private connections'
      connection = `wss://api-testnet.brine.fi/private?auth_header=${jwt}`
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

  async subOrUnsub(event: 'subscribe' | 'unsubscribe', streams: string[]) {
    const msg = {
      event,
      streams,
    }

    try {
      this.ws.send(JSON.stringify(msg))
    } catch (e) {
      throw e
    }
  }
}
