import { AxiosError } from 'axios'
import * as dotenv from 'dotenv'
import { CreateOrderNonceBody, Response } from '../src/types'
import { Client } from '../src/client'
import { isAuthenticationError } from '../src/error'
import {
  createUserSignature,
  generateKeyPairFromEthPrivateKey,
  getKeyPairFromSignature,
  signOrderNonceWithSignature,
  signOrderWithStarkKeys,
} from '../src'
import { Wallet, ethers } from 'ethers'
import { TESTNET } from '../src/constants'
dotenv.config()

const main = async () => {
  // load your privateKey and walletAddress
  const privateKey = process.env.PRIVATE_KEY
  const ethAddress = process.env.ETH_ADDRESS
  const brineOrganizationKey = process.env.BRINE_ORGANIZATION_KEY
  const brineApiKey = process.env.BRINE_API_KEY

  if (privateKey && ethAddress) {
    // handle in try catch block
    try {
      // create a rest client instance (you can pass option)
      const client = new Client('testnet')

      //you can use public endpoints right away
      const test = await client.testConnection()
      const candleStick = await client.get24hPrice()
      // login to use private endpoints
      const loginRes = await client.completeLogin(ethAddress, privateKey)
      console.log(loginRes.payload)

      // create an order nonce
      const nonceBody: CreateOrderNonceBody = {
        market: 'btcusdc',
        ord_type: 'market',
        price: 29580.51,
        side: 'buy',
        volume: 0.0001,
      }

      // create order (private)
      // const order = await client.createCompleteOrder(nonceBody, privateKey)

      // const orderNonce = await client.createOrderNonce(nonceBody)
      const userSignature = createUserSignature(privateKey, 'testnet') // or sign it yourself
      const keyPair = getKeyPairFromSignature(userSignature.signature)
      const stark_public_key = keyPair.getPublic().getX().toString('hex')
      const stark_private_key = keyPair.getPrivate().toString('hex')
      const provider = new ethers.providers.JsonRpcProvider(
        process.env.RPC_PROVIDER,
      )
      const signer = new Wallet(privateKey, provider)

      const res = await client.deposit(
        signer,
        provider,
        `0x${stark_public_key}`,
        '0.00001',
        'eth',
      )
      // const res = await client.getTokenBalance(provider, ethAddress, 'btc')
      console.log(res)
      // console.log({
      //   stark_private_key,
      //   stark_public_key,
      // })
      // const keyPair = getKeyPairFromSignature(userSignature.signature)
      // const signedBody = signOrderWithStarkKeys(keyPair, orderNonce.payload)
      // const order = await client.createNewOrder({ ...signedBody })

      // console.log(order)
      // const orders = await client.listOrders()
      // console.log(orders.payload[0])

      // // get profile info (private)
      // const profile = await client.getProfileInfo()
      // console.log(profile.payload.username)
    } catch (e) {
      // Error: AuthenticationError | AxiosError
      if (isAuthenticationError(e)) {
        console.log(e)
      } else {
        console.log(e)

        console.log((e as AxiosError<Response<string>>)?.response?.data)
      }
    }
  }
}

main()

const internalTransfers = async () => {
  // load your privateKey and walletAddress
  const privateKey = process.env.PRIVATE_KEY
  const ethAddress = process.env.ETH_ADDRESS
  const brineOrganizationKey = process.env.BRINE_ORGANIZATION_KEY
  const brineApiKey = process.env.BRINE_API_KEY

  if (privateKey && ethAddress) {
    // handle in try catch block
    try {
      // create a rest client instance (you can pass option)
      const client = new Client('testnet')
      // login to use private endpoints
      const loginRes = await client.completeLogin(ethAddress, privateKey)
      console.log(loginRes.payload)

      // Getting the L2 keypair
      const keypair = generateKeyPairFromEthPrivateKey(privateKey, 'testnet') // default is mainnet
      // Executing the internalTransfer
      const internalTransferResponse =
        await client.initiateAndProcessInternalTransfers(
          keypair,
          brineOrganizationKey as string,
          brineApiKey as string,
          'usdc',
          1,
          '0xF5F467c3D86760A4Ff6262880727E854428a4996',
        )
      // Listing the internalTransfers
      const internalTransferList = await client.listInternalTransfers()
      console.log(internalTransferList.payload)

      if (internalTransferList.payload.internal_transfers.length) {
        // Get the internal transfer by client ID
        const internalTransferById = await client.getInternalTransferByClientId(
          internalTransferList.payload.internal_transfers[0]
            .client_reference_id,
        )
        console.log(internalTransferById.payload)
      }
    } catch (e) {
      // Error: AuthenticationError | AxiosError
      if (isAuthenticationError(e)) {
        console.log(e)
      } else {
        console.log((e as AxiosError<Response<string>>)?.response?.data)
      }
    }
  }
}

// internalTransfers()
