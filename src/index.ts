import { Client } from './client'
import { WsClient } from './wsClient'
import { isAuthenticationError } from './error'
import { signMsg } from './bin/blockchain_utils'

export { Client, WsClient, isAuthenticationError, signMsg }
export * from './types'

export default {
  Client,
  WsClient,
  isAuthenticationError,
}
