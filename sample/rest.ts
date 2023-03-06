import { Client } from '../src/client'
import * as dotenv from 'dotenv'
import { CreateNewOrderBody, CreateOrderNonceBody, Response } from '..'
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
      const loginRes = await client.completeLogin(ethAddress, privateKey)

      //   const nonceBody: CreateOrderNonceBody = {
      //     market: 'btcusdt',
      //     ord_type: 'market',
      //     price: 29580.51,
      //     side: 'buy',
      //     volume: 0.0001,
      // }

      const order = await client.listTrades()
      // console.log(res)
      console.log(order.payload[0].fee_currency)
    } catch (e) {
      if (isResponseError(e)) {
        console.log(e)
      } else {
        console.log((e as AxiosError)?.response)
      }
    }
  }
}

main()

const isResponseError = (err: unknown): err is Response<string> => {
  return (<Response<string>>err).message !== undefined
}
