import { Client, WsClient } from '../src'
import * as dotenv from 'dotenv'
dotenv.config()

const main = async () => {
  try {
    const privateKey = process.env.PRIVATE_KEY
    const ethAddress = process.env.ETH_ADDRESS
    const client = new Client()
    if (privateKey && ethAddress) {
      // const wsClient = new WsClient('public')

      // await wsClient.connect()
      // await wsClient.subscribe([
      //   'btcusdc.trades',
      //   'btcusdc.ob-inc',
      //   'btcusdc.kline-5m',
      // ])
      // await wsClient.subscribe(['btcusdt.ob-inc'])

      // wsClient.ws.on('message', (data) => {
      //   console.log(data.toString())
      // })
      // const loginRes = await client.completeLogin(ethAddress, privateKey)
      // // @ts-expect-error
      const wsClient = new WsClient('private')

      await wsClient.connect()
      await wsClient.subscribe(['trade', 'order'])

      wsClient.ws.on('message', (data) => {
        console.log(data.toString())
      })
    }
  } catch (e) {
    console.log(e)
  }
}
main()
