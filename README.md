# Brine WrapperJS

## _A NodeJS Wrapper for the Brine API_

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://brine-assets-public.s3.ap-southeast-1.amazonaws.com/img/logo-white.png">
  <source media="(prefers-color-scheme: light)" srcset="https://brine-assets-public.s3.ap-southeast-1.amazonaws.com/img/krypto-logo-dark.png">
  <img alt="Shows an illustrated sun in light mode and a moon with stars in dark mode." src="https://www.brine.finance/img/brine-logo-dark.png" width="300">
</picture>

Brine-wrapperJS is a NodeJS wrapper for the [Brine API](https://docs.brine.finance/docs/introduction).

## Features

- Complete endpoints including REST and WebSockets
- Methods return parsed JSON.
- High level abstraction for ease of use.
- Easy authentication
- Automatically sets JWT token internally
- Auto re-login when JWT expires
- Typescript Types✨

Brine-wrapperJS includes utility/connector functions which can be used to interact with the Brine API. It uses axios internally to handle all requests. It includes interceptors for handling setting JWT and re-login on token expiry.

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

The default base url is https://api-testnet.brine.fi .You can change it by providing a baseUrl through the constructor. All REST apis, WebSockets are handled by Client, WsClient classes respectively. All operations must be handled in a try-catch block.

### Workflow

Check out the [sample files](./sample) to see an example workflow.

### Rest Client

Import the REST Client

```ts
import { Client } from './wsClient'
```

Create a new instance

```ts
const client = new Client()
// or
const client = new Client(baseUrl)
```

### General Endpoints

#### Test connectivity

`GET /sapi/v1/health/`

```ts
client.testConnection()
```

#### 24hr Price

`GET /sapi/v1/market/tickers/`

```ts
client.get24hPrice({market: 'ethusdc'})
```

#### Kline/Candlestick Data

`GET /sapi/v1/market/kline/`

```ts
client.getCandlestick({
   market: 'ethusdc',
   period: 120,
})
```

#### Order Book

`GET /sapi/v1/market/orderbook/`

```ts
client.getOrderBook({
     market: 'ethusdc',
})
```

#### Recent trades

`GET /sapi/v1/market/trades/`

```ts
client.getRecentTrades({
    market: 'ethusdc',
})
```

#### Login

Both login() and completeLogin() sets JWT as Authorization Token. Optionally, setToken() can be used to set JWT token directly, but this will not allow client to auto-relogin on token expiry.

getNonce: `POST /sapi/v1/auth/nonce/`  
login: `POST /sapi/v1/auth/login/`

```ts
const nonce = await client.getNonce(ethAddress)
const signedMsg = signMsg(nonce.payload, privateKey)
const loginRes = await client.login(ethAddress, signedMsg.signature)

// or

const loginRes = await client.completeLogin(ethAddress, privateKey) //calls above functions internally

// or

client.setToken(jwt)
```

#### Profile Information (Private 🔒)

`GET /sapi/v1/user/profile/`

```ts
client.getProfileInfo()
```

#### Balance details (Private 🔒)

`GET /sapi/v1/user/balance/`

```ts
client.getBalance()
```

#### Profit and Loss Detailss (Private 🔒)

`GET /sapi/v1/user/pnl/`

```ts
client.getProfitAndLoss()
```

#### Create order (Private 🔒)

Create Nonce Body

```ts
const nonceBody: CreateOrderNonceBody = {
    market: 'btcusdt',
    ord_type: 'market',
    price: 29580.51,
    side: 'buy',
    volume: 0.0001,
}
```

Create Order

createOrderNonce: `POST /sapi/v1/orders/nonce/`  
createNewOrder: `POST /sapi/v1/orders/create/`

```ts
const nonceRes = await client.createOrderNonce(nonceBody)
const signedBody = client.signMsgHash(nonceRes.payload, privateKey)
const order = await client.createNewOrder(signedBody)

// or

const order = await client.createCompleteOrder(nonceBody, privateKey) //calls above functions internally
```

#### Get Order (Private 🔒)

`GET /sapi/v1/orders/{order_id}/`

```ts
client.getOrder(orderId)
```

#### List orders (Private 🔒)

`GET /sapi/v1/orders/`

```ts
client.listOrders()
```

#### Cancel Order (Private 🔒)

`POST /sapi/v1/orders/cancel/`

```ts
client.cancelOrder(order_id)
```

#### List Trades (Private 🔒)

`GET /sapi/v1/trades/`

```ts
client.listTrades()
```

### WebSocket Client

Import the WebSocket Client

```ts
import { WsClient } from 'brine-wrapperjs'
```

Create a new instance

```ts
const wsClient = new WsClient('public')
// or
const wsClient = new WsClient('public', null, baseUrl)
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
const streams = [
  'btcusdc.trades',
  'btcusdc.ob-inc',
  'btcusdc.kline-5m',
]
wsClient.subscribe(streams)
```

#### Unsubscribe

```ts
const streams = [
  'btcusdc.trades',
  'btcusdc.ob-inc',
  'btcusdc.kline-5m',
]
wsClient.unsubscribe(streams)
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

### Error Handling

Errors thrown are of types `AuthenticationError | AxiosError`.  

Example

```ts
import { isAuthenticationError } from 'brine-wrapperjs'
try{
  // async operations
} catch (e) {
  if (isAuthenticationError(e)) {
    console.log(e)
  } else {
    console.log((e as AxiosError<Response<string>>))
  }
}
```

