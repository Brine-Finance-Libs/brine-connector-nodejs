import { Client } from '../src/client'
import * as dotenv from 'dotenv'
import { ClientError, CreateNewOrderBody, CreateOrderNonceBody, Response } from '..'
import { signMsg } from '../src/bin/blockchain_utils'
import { AxiosError } from 'axios'
dotenv.config()

const main = async () => {
  const privateKey = process.env.PRIVATE_KEY
  const ethAddress = process.env.ETH_ADDRESS
  // const jwt = process.env.JWT

  if (privateKey && ethAddress) {
    try {
      const client = new Client()

      const res = await client.testConnection()
      // const loginRes = await client.completeLogin(ethAddress, privateKey)

        const nonceBody: CreateOrderNonceBody = {
          market: 'btcusdt',
          ord_type: 'market',
          price: 29580.51,
          side: 'buy',
          volume: 0.0001,
      }

      const order = await client.createOrderNonce(nonceBody)
      // console.log(res)
      console.log(order.payload.msg_hash)
    } catch (e) {
      if (isClientError(e)) {
        console.log(e)
      } else {
        console.log((e as AxiosError<Response<string>>))
      }
    }
  }
}

main()

const isClientError = (err: unknown): err is ClientError => {
  return (<ClientError>err).type !== undefined
}
