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
      
    } catch (e) {
      console.log(e as Response<string>)
    }
  }
}

main()
