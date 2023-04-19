import { Client } from './client'
import { WsClient } from './wsClient'
import { isAuthenticationError } from './error'
import { signMsg } from './bin/blockchain_utils'
import { signMsgHash } from './utils'

export { Client, WsClient, isAuthenticationError, signMsg, signMsgHash }
export * from './types'

export default {
  Client,
  WsClient,
  isAuthenticationError,
  signMsgHash,
}
