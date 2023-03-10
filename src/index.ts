import { Client } from './client'
import { WsClient } from './wsClient'
import { isAuthenticationError } from './error'

export { Client, WsClient, isAuthenticationError }
export * from './types'

export default {
  Client,
  WsClient,
  isAuthenticationError,
}
