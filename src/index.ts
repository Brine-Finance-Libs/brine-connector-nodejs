import { Client } from './bin/client'
import * as dotenv from 'dotenv'
import { Response } from './types'
import { signMsg } from './bin/blockchain_utils'
import { WsClient } from './bin/wsClient'
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
      // const res = await client.getRecentTrades({
      //   market: 'ethusdc',
      // })
      // const loginRes = await client.completeLogin(ethAddress, privateKey)
      // console.log(loginRes)

      // client.getProfitAndLoss().then(res => {
      //   res.payload['']
      // })
      // console.log(res.payload)
      // const nonce = await client.createOrderNonce({
      //   market: 'btcusdt',
      //   ord_type: 'limit',
      //   price: 29580.51,
      //   side: 'sell',
      //   volume: 0.015,
      // })

      // console.log(nonce.payload)

      // const signedMsg = signMsg(nonce.payload, privateKey)

      // const { payload } = await client.createNewOrder({
      //   msg_hash: '',
      //   nonce: 0,
      //   signature: { r: '', s: '' },
      // })

      const nonce = await client.getNonce(ethAddress)
      const signedMsg = signMsg(nonce.payload, privateKey)
      const loginRes = await client.login(ethAddress, signedMsg.signature)

      const trades = await client.listTrades()
      console.log(trades)

      // // const orders = await client.listOrders()
      // // console.log(orders.payload)

      // const wsClient2 = new WsClient('public')

      // await wsClient2.connect()
      // await wsClient2.subOrUnsub('subscribe', [
      //   'btcusdc.trades',
      //   'btcusdc.ob-inc',
      //   'btcusdc.kline-5m',
      // ])

      // wsClient2.ws.on('message', (data) => {
      //   console.log(data.toString())
      // })
      // // @ts-expect-error
      // const wsClient = new WsClient('private', loginRes.token.access)

      // await wsClient.connect()
      // await wsClient.subOrUnsub('subscribe', ['trade', 'order'])

      // wsClient.ws.on('message', (data) => {
      //   console.log(data.toString())
      // })
      // await wsClient.subOrUnsub('unsubscribe', [
      //   'btcusdc.trades',
      //   'btcusdc.ob-inc',
      //   'btcusdc.kline-5m',
      // ])
    } catch (e) {
      console.log(e as Response<string>)
    }

    try {
      console.log('profile res')
      const profileRes = await client.getBalance()
      console.log(profileRes.payload)
    } catch (error) {
      console.log(error)
    }
  }
}

main()
