import { Client } from './client'
import { WsClient } from './wsClient'
import { isAuthenticationError } from './error'
import { signMsg } from './bin/blockchain_utils'
import { getKeyPairFromSignature } from './bin/signature'
import {
  signMsgHash,
  createUserSignature,
  SignOrderNonceWithSignature,
  SignOrderWithStarkKeys,
  generateKeyPairFromEthPrivateKey,
} from './utils'

export {
  Client,
  WsClient,
  isAuthenticationError,
  signMsg,
  signMsgHash,
  createUserSignature,
  SignOrderNonceWithSignature,
  getKeyPairFromSignature,
  SignOrderWithStarkKeys,
  generateKeyPairFromEthPrivateKey,
}
export * from './types'

export default {
  Client,
  WsClient,
  isAuthenticationError,
  signMsg,
  signMsgHash,
  createUserSignature,
  SignOrderNonceWithSignature,
  getKeyPairFromSignature,
  SignOrderWithStarkKeys,
  generateKeyPairFromEthPrivateKey,
}
