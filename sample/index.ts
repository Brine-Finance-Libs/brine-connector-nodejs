import { Client } from '../src/client'
import * as dotenv from 'dotenv'
import { CreateNewOrderBody, CreateOrderNonceBody, Response } from '..'
import { signMsg } from '../src/bin/blockchain_utils'
import { WsClient } from '../src/wsClient'
import { getKeyPairFromSignature, sign } from '../src/bin/signature'
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
      const loginRes = await client.completeLogin(ethAddress, privateKey)

      // const nonce = await client.createOrderNonce()

      // const signedMsg = client.signMsgHash(nonce.payload, privateKey)

      // const order = await client.createNewOrder(signedMsg)
      // const nonce: CreateOrderNonceBody = {
      //   market: 'btcusdt',
      //   ord_type: 'market',
      //   price: 29580.51,
      //   side: 'buy',
      //   volume: 0.0001,
      // }

      // const order = await client.createCompleteOrder(nonce, privateKey)
      // console.log(order)

      const nonceBody: CreateOrderNonceBody = {
        market: 'btcusdt',
        ord_type: 'market',
        price: 29580.51,
        side: 'buy',
        volume: 0.0001,
      }
      const order = await client.createCompleteOrder(nonceBody, privateKey)
      console.log(order)

      // console.log(createOrderRequestData)

      // const res = await client.createNewOrder(createOrderRequestData)
      // console.log(res)

      // const signedMsg = signMsg(nonce.payload, privateKey)

      // const { payload } = await client.createNewOrder({
      //   msg_hash: '',
      //   nonce: 0,
      //   signature: { r: '', s: '' },
      // })

      // const nonce = await client.getNonce(ethAddress)
      // const signedMsg = signMsg(nonce.payload, privateKey)
      // const loginRes = await client.login(ethAddress, signedMsg.signature)

      // const trades = await client.listTrades()
      // console.log(trades)

      // const orders = await client.listOrders()
      // console.log(orders.payload)

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

    // try {
    //   console.log('profile res')
    //   const profileRes = await client.listOrders()
    //   console.log(profileRes.payload)
    // } catch (error) {
    //   console.log(error)
    // }
  }
}

main()
