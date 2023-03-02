import { Client } from './bin/client'
import * as dotenv from 'dotenv'
import { Response } from './types'
dotenv.config()

const main = async () => {
  const client = new Client()

  const privateKey = process.env.PRIVATE_KEY
  const ethAddress = process.env.ETH_ADDRESS

  if (privateKey && ethAddress) {
    try {
      // const testRes = await client.testConnection()
      // console.log(testRes)

      // const res = await client.get24hPrice({market: 'ethusdc'})
      // console.log(res)
      // const res = await client.getCandlestick({
      //   market: 'ethusdc',
      //   period: 120,
      // })
      // const res = await client.getOrderBook({
      //   market: 'ethusdc',
      // })
      const res = await client.getRecentTrades({
        market: 'ethusdc',
      })
      console.log(res.message)

      // const loginRes = await client.login(ethAddress, privateKey)
      // console.log(loginRes.message)

      // const profileRes = await client.getProfileInfo()
      // console.log(profileRes)
    } catch (e) {
      console.log(e as Response<string>)
    }
  }
}

main()
