# Brine WrapperJS
## _A NodeJS Wrapper for the Brine API_

![N|Solid](https://www.brine.finance/img/brine-logo-nas.png)

Brine-wrapperJS is a NodeJS wrapper for the [Brine API](https://docs.brine.finance/docs/introduction).

## Features

- Complete endpoints including REST and WebSockets
- Methods return parsed JSON.
- Easy authentication
- Automatically sets JWT token internally
- Auto relogin when JWT expires
- Typescript Types✨

Brine-wrapperJS uses axios internally to handle all requests. It includes interceptors for handling setting JWT and Relogin on token expiry.

## Installation

First go to the [Brine Website](https://www.brine.finance/) and create an account with your wallet.

Clone this repository.
```sh
git clone https://github.com/upsurge0/brine-wrapperjs.git
```

Install the dependencies and devDependencies.

```sh
npm i
```
or
```sh
yarn
```
or
```sh
pnpm i
```

## Getting Started

The default base url is https://api-testnet.brine.fi
You can change it by providing a baseUrl through the constructor.
All REST apis, WebSockets are handled by Client, WsClient classes respectively

#### Rest Client
Import the REST Client
```ts
import {Client} from './client'
```
Create a new instance
```ts
const client = new Client()
// or
const client = new Client(baseUrl)
```

### General Endpoints
#### Test connectivity
```ts
client.testConnection()
```
#### 24hr Price
```ts
client.get24hPrice({market: 'ethusdc'})
```
#### Kline/Candlestick Data
```ts
client.getCandlestick({
   market: 'ethusdc',
   period: 120,
})
```
#### Order Book
```ts
client.getOrderBook({
     market: 'ethusdc',
})
```
#### Recent trades
```ts
client.getRecentTrades({
    mmarket: 'ethusdc',
})
```
#### Login
Both login() and completeLogin() sets JWT as Authorization Token.
```ts
const nonce = await client.getNonce(ethAddress)
const signedMsg = signMsg(nonce.payload, privateKey)
const loginRes = await client.login(ethAddress, signedMsg.signature)

// Alerternatively

const loginRes = await client.completeLogin(ethAddress, privateKey)
```
#### Profile Information (Private 🔒)
```ts
client.getProfileInfo()
```
#### Balance details (Private 🔒)
```ts
client.getBalance()
```
#### Profit and Loss Detailss (Private 🔒)
```ts
client.getProfitAndLoss()
```
#### Create order (Private 🔒)
```ts
const nonce = await client.createOrderNonce({
    market: 'btcusdt',
    ord_type: 'limit',
    price: 29580.51,
    side: 'sell',
    volume: 0.015,
})
// sign the msg_hash
const res = await client.createNewOrder(signedBody)
```
#### Get Order (Private 🔒)
```ts
client.getOrder(orderId)
```
#### List orders (Private 🔒)
```ts
client.listOrders()
```
#### Cancel Order (Private 🔒)
```ts
client.cancelOrder({order_id})
```
#### List Trades (Private 🔒)
```ts
client.listTrades()
```

### WebSocket Client
Import the WebSocket Client
```ts
import {WsClient} from './wsClient'
```
Create a new instance
```ts
const wsClient = new WsClient('public')
// or
const wsClient = new WsClient('public', undefined, baseUrl)
// or
const loginRes = await client.completeLogin(ethAddress, privateKey)
const wsClient = new WsClient('private', loginRes.payload.token.access)
```

#### Connect
```ts
wsClient.connect()
```
#### Subscribe
```ts
wsClient.subOrUnsub('subscribe', streams)
```
#### Unsubscribe
```ts
wsClient.subOrUnsub('unsubscribe', streams)
```
#### Disconnect
```ts
wsClient.disconnect()
```
#### Usage
WsClient includes a member called ws which is initialized with the [NodeJS WebSocket library](https://github.com/websockets/ws) (ws). You may use it to handle WebSocket operations.
```ts
wsClient.ws.on('message', (data) => {
    console.log(data.toString())
})
```
