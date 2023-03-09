import Web3 from 'web3'
const web3 = new Web3()

export const signMsg = (data, privateKey) => {
  return web3.eth.accounts.sign(data, privateKey)
}

export function getKeySeed(signature) {
  const keySeed = web3.utils.keccak256(String(BigInt(signature)))
  return keySeed
}

export default {
  signMsg,
  getKeySeed,
}
