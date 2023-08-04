import { ec } from 'elliptic'
import { signMsg } from './bin/blockchain_utils'
import { getKeyPairFromSignature, sign } from './bin/signature'
import {
  CoinStat,
  CreateNewOrderBody,
  CreateOrderNoncePayload,
  StarkSignature,
  Sign,
} from './types'
import { Wallet, ethers } from 'ethers'
import { CONFIG, MAX_INT_ALLOWANCE } from './constants'
import { CoinNotFoundError } from './error'
import { BigNumber } from 'ethers'

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

export const signWithdrawalTxMsgHash = (
  keyPair: ec.KeyPair,
  msgHash: string,
): StarkSignature => {
  const msgHex = BigNumber.from(msgHash).toHexString()
  const msg = sign(keyPair, removeHexPrefix(msgHex))

  const signature: StarkSignature = {
    r: `0x${msg.r.toString('hex')}`,
    s: `0x${msg.s.toString('hex')}`,
    recoveryParam: msg.recoveryParam,
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

export const getNonce = (
  signer: Wallet,
  provider: ethers.providers.Provider,
) => {
  const baseNonce = provider.getTransactionCount(signer.getAddress())
  let nonceOffset = 0
  return baseNonce.then((nonce: number) => nonce + nonceOffset++)
}

export const dequantize = (number: number, decimals: number) => {
  const factor = 10 ** decimals
  return number / factor
}

export const get0X0to0X = (address: string) => {
  if (
    address?.substring(0, 3) === '0x0' ||
    address?.substring(0, 3) === '0X0'
  ) {
    return address.replace('0x0', '0x')
  } else {
    return address
  }
}

export const getAllowance = async (
  userAddress: string,
  starkContract: string,
  tokenContract: string,
  decimal: number,
  provider: ethers.providers.Provider,
) => {
  const contract = new ethers.Contract(
    tokenContract,
    CONFIG.ERC20_ABI,
    provider,
  )
  const allowance = await contract.allowance(userAddress, starkContract)
  return dequantize(Number(allowance), decimal)
}

export const approveUnlimitedAllowanceUtil = async (
  starkContract: string,
  tokenContract: string,
  signer: ethers.Signer,
) => {
  const contract = new ethers.Contract(tokenContract, CONFIG.ERC20_ABI, signer)
  const amount = ethers.BigNumber.from(MAX_INT_ALLOWANCE)
  console.log({ amount: amount.toString() })
  const approval = await contract.approve(starkContract, amount)
  return approval
}

export const filterCurrentCoin = (coinStatsPayload: CoinStat, coin: string) => {
  const currentCoin = Object.keys(coinStatsPayload)
    .map((coinName) => {
      if (coinStatsPayload[coinName].symbol === coin) {
        return coinStatsPayload[coinName]
      }
    })
    .filter((c) => c !== undefined)[0]
  if (!currentCoin) throw new CoinNotFoundError(`Coin '${coin}' not found`)
  return currentCoin
}

export const formatWithdrawalAmount = (
  amount: number,
  decimals: number,
  symbol: string,
) => {
  if (symbol === 'eth') {
    return amount ? String(ethers.utils.formatEther(amount)) : '0'
  } else {
    return String(dequantize(amount, decimals))
  }
}

export const removeHexPrefix = (str: string, removeOx0 = false) => {
  // Use a regular expression to remove "0x0" and "0x" from the beginning of the string
  if (removeOx0) {
    return str.replace(/^(0x0|0x)/, '')
  } else {
    return str.replace(/^0x/, '')
  }
}
