import { Client } from '../src/client'
import * as dotenv from 'dotenv'
import { CreateNewOrderBody, CreateOrderNonceBody, Response } from '..'
import { signMsg } from '../src/bin/blockchain_utils'
dotenv.config()

const main = async () => {
  const privateKey = process.env.PRIVATE_KEY
  const ethAddress = process.env.ETH_ADDRESS
  // const jwt = process.env.JWT

  if (privateKey && ethAddress) {
    try {
      const client = new Client()

      const loginRes = await client.completeLogin(ethAddress, privateKey)
      
    //   const nonceBody: CreateOrderNonceBody = {
    //     market: 'btcusdt',
    //     ord_type: 'market',
    //     price: 29580.51,
    //     side: 'buy',
    //     volume: 0.0001,
    // }

      const order = await client.cancelOrder(16033822)
      console.log(order)
    } catch (e) {
      console.log(e as Response<string>)
    }
  }
}

main()
