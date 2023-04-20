import Web3 from 'web3'
import { Sign } from '../types'
const web3 = new Web3()

export const signMsg = (data: string, privateKey: string): Sign => {
  return web3.eth.accounts.sign(data, privateKey)
}

export function getKeySeed(signature: string) {
  const keySeed = web3.utils.keccak256(String(BigInt(signature)))
  return keySeed
}

export default {
  signMsg,
  getKeySeed,
}
