import { ec } from 'elliptic'
import { signMsg } from './bin/blockchain_utils'
import { getKeyPairFromSignature, sign } from './bin/signature'
import {
  CreateNewOrderBody,
  CreateOrderNoncePayload,
  Sign,
  StarkSignature,
} from './types'

export const signMsgHash = (
  nonce: CreateOrderNoncePayload,
  privateKey: string,
  option: 'mainnet' | 'testnet' = 'mainnet',
): CreateNewOrderBody => {
  const userSignature = createUserSignature(privateKey, option)
  return signOrderNonceWithSignature(userSignature, nonce)
}

export const createUserSignature = (
  privateKey: string,
  option: 'mainnet' | 'testnet' = 'mainnet',
): Sign => {
  const msgToBeSigned =
    option === 'testnet'
      ? "Click sign to verify you're a human - Brine.finance"
      : 'Get started with Brine. Make sure the origin is https://trade.brine.fi'
  const userSignature = signMsg(msgToBeSigned, privateKey)
  return userSignature
}

export const signOrderNonceWithSignature = (
  userSignature: Sign,
  nonce: CreateOrderNoncePayload,
): CreateNewOrderBody => {
  const keyPair = getKeyPairFromSignature(userSignature.signature)
  return signOrderWithStarkKeys(keyPair, nonce)
}

export const signOrderWithStarkKeys = (
  keyPair: ec.KeyPair,
  nonce: CreateOrderNoncePayload,
): CreateNewOrderBody => {
  const msg = sign(keyPair, nonce.msg_hash.replace('0x', ''))
  const createOrderBody: CreateNewOrderBody = {
    msg_hash: nonce.msg_hash,
    signature: {
      r: `0x${msg.r.toString('hex')}`,
      s: `0x${msg.s.toString('hex')}`,
    },
    nonce: nonce.nonce,
  }
  return createOrderBody
}

export const signInternalTxMsgHash = (
  keyPair: ec.KeyPair,
  msgHash: string,
): StarkSignature => {
  const msg = sign(keyPair, msgHash.replace('0x', ''))
  const signature: StarkSignature = {
    r: `0x${msg.r.toString('hex')}`,
    s: `0x${msg.s.toString('hex')}`,
  }
  return signature
}

export const generateKeyPairFromEthPrivateKey = (
  ethPrivateKey: string,
  option: 'mainnet' | 'testnet' = 'mainnet',
) => {
  const signature = createUserSignature(ethPrivateKey, option)
  return getKeyPairFromSignature(signature.signature)
}
