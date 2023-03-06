import { Client, WsClient } from '../src'

try {
  const privateKey = process.env.PRIVATE_KEY
  const ethAddress = process.env.ETH_ADDRESS
  const client = new Client()

  if (privateKey && ethAddress) {
      const wsClient = new WsClient('public')
      
      await wsClient.connect()
    await wsClient.subscribe([
      'btcusdc.trades',
      'btcusdc.ob-inc',
      'btcusdc.kline-5m',
    ])
    await wsClient.subscribe(['btcusdt.ob-inc'])
    
    wsClient.ws.on('message', (data) => {
        console.log(data.toString())
    })
    // const loginRes = await client.completeLogin(ethAddress, privateKey)
    // // @ts-expect-error
    //   const wsClient = new WsClient('private', loginRes.token.access)

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
  }
} catch (e) {
  console.log(e)
}
