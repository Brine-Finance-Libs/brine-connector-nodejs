import Web3 from 'web3'
const web3 = new Web3()

export const signMsg = (data: string, privateKey: string) => {
  return web3.eth.accounts.sign(data, privateKey)
}

export function getKeySeed(signature: string | number | bigint | boolean) {
  const keySeed = web3.utils.keccak256(String(BigInt(signature)))
  return keySeed
}
