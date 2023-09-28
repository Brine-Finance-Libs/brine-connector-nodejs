import { Client } from './client'
import { WsClient } from './wsClient'
import { isAuthenticationError } from './error'
import { signMsg } from './bin/blockchain_utils'
import { getKeyPairFromSignature } from './bin/signature'
import {
  signMsgHash,
  createUserSignature,
  signOrderNonceWithSignature,
  signOrderWithStarkKeys,
  generateKeyPairFromEthPrivateKey,
} from './utils'

export {
  Client,
  WsClient,
  isAuthenticationError,
  signMsg,
  signMsgHash,
  createUserSignature,
  signOrderNonceWithSignature,
  getKeyPairFromSignature,
  signOrderWithStarkKeys,
  generateKeyPairFromEthPrivateKey,
}
export * from './types'
export * from './constants'

export default {
  Client,
  WsClient,
  isAuthenticationError,
  signMsg,
  signMsgHash,
  createUserSignature,
  signOrderNonceWithSignature,
  getKeyPairFromSignature,
  signOrderWithStarkKeys,
  generateKeyPairFromEthPrivateKey,
}
