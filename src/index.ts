import { Client } from './client'
import { WsClient } from './wsClient'
import { isAuthenticationError } from './error'
import { signMsg } from './bin/blockchain_utils'
import {
  signMsgHash,
  createUserSignature,
  SignOrderWithStarkKeys,
} from './utils'

export {
  Client,
  WsClient,
  isAuthenticationError,
  signMsg,
  signMsgHash,
  createUserSignature,
  SignOrderWithStarkKeys,
}
export * from './types'

export default {
  Client,
  WsClient,
  isAuthenticationError,
  signMsg,
  signMsgHash,
  createUserSignature,
  SignOrderWithStarkKeys,
}
