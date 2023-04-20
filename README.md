# Brine Connector NodeJS

## _A NodeJS Connector for the Brine API_

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://brine-assets-public.s3.ap-southeast-1.amazonaws.com/img/logo-white.png">
  <source media="(prefers-color-scheme: light)" srcset="https://brine-assets-public.s3.ap-southeast-1.amazonaws.com/img/krypto-logo-dark.png">
  <img alt="Shows an illustrated sun in light mode and a moon with stars in dark mode." src="https://www.brine.finance/img/brine-logo-dark.png" width="300">
</picture>

Brine Connector is a NodeJS connector/wrapper for the [Brine API](https://docs.brine.fi/api-documentation).

## Features

- Complete endpoints including REST and WebSockets
- Methods return parsed JSON.
- High level abstraction for ease of use.
- Easy authentication
- Automatically sets JWT token internally
- Auto re-login when JWT expires
- Typescript Types✨

Brine Connector includes utility/connector functions which can be used to interact with the Brine API. It uses axios internally to handle all requests. It includes interceptors for handling setting JWT and re-login on token expiry.

## Installation

First go to the [Brine Website](https://www.brine.finance/) and create an account with your wallet.

Clone the repo

```sh
git clone https://github.com/brine-finance/brine-connector-nodejs.git
cd brine-connector-nodejs
```

Install dependencies
```sh
npm i
```

To use library in other projects  
Run inside cloned repository to generate dist folder
```sh
npm run build
```

Go to your main nodejs project
```sh
npm link /path/to/local_repository # the path to brine-connector-nodejs repository you just cloned
```


## Getting Started

The default base url for mainnet is https://api.brine.fi and testnet is https://api-testnet.brine.fi. You can choose between mainnet and testnet by providing it through the constructor. All REST apis, WebSockets are handled by Client, WsClient classes respectively. All operations must be handled in a try-catch block.

### Workflow

Check out the [example files](./example) to see an example workflow.

To use library inside example files

```sh
npm run start
npm run start:ws
```

### Rest Client

Import the REST Client

```ts
import { Client } from 'brine-connector'
```

Create a new instance.  
Choose between mainnet or testnet

```ts
const client = new Client()
// or
const client = new Client('mainnet') //'mainnet' or 'testnet'
```

### General Endpoints

#### Utils

Get available markets on Mainnet and Testnet

```ts
import { MAINNET, TESTNET } from 'brine-connector'
```

#### Test connectivity

`GET /sapi/v1/health/`

```ts
client.testConnection()
```

#### 24hr Price

`GET /sapi/v1/market/tickers/`

```ts
client.get24hPrice({market: MAINNET.markets.ethusdc})
```

#### Kline/Candlestick Data

`GET /sapi/v1/market/kline/`

```ts
client.getCandlestick({
   market: MAINNET.markets.ethusdc,
   period: 120,
})
```

#### Order Book

`GET /sapi/v1/market/orderbook/`

```ts
client.getOrderBook({
     market: MAINNET.markets.ethusdc,
})
```

#### Recent trades

`GET /sapi/v1/market/trades/`

```ts
client.getRecentTrades({
    market: MAINNET.markets.ethusdc,
})
```

#### Login

Both login() and completeLogin() sets JWT as Authorization Token. Optionally, setToken() can be used to set JWT token directly, but this will not allow client to auto-relogin on token expiry.

getNonce: `POST /sapi/v1/auth/nonce/`  
login: `POST /sapi/v1/auth/login/`

```ts
import { signMsg } from 'brine-connector'

const nonce = await client.getNonce(ethAddress)
const signedMsg = signMsg(nonce.payload, ethPrivateKey)
const loginRes = await client.login(ethAddress, signedMsg.signature)

// or

const loginRes = await client.completeLogin(ethAddress, ethPrivateKey) //calls above functions internally

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

#### Profit and Loss Details (Private 🔒)

`GET /sapi/v1/user/pnl/`

```ts
client.getProfitAndLoss()
```

#### Create order (Private 🔒)

Create Nonce Body

```ts
const nonceBody: CreateOrderNonceBody = {
    market: MAINNET.markets.ethusdc,
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
const order = await client.createCompleteOrder(nonceBody, ethPrivateKey) 
//calls below functions internally, we recommend using createCompleteOrder for ease of use

// or
import { signMsgHash } from 'brine-connector'

const orderNonce = await client.createOrderNonce(nonceBody)
const signedBody = signMsgHash(orderNonce.payload, ethPrivateKey)
const order = await client.createNewOrder(signedBody)


// or
import {
  createUserSignature,
  getKeyPairFromSignature,
  SignOrderWithStarkKeys,
} from 'brine-connector'

const orderNonce = await client.createOrderNonce(nonceBody)
const userSignature = createUserSignature(privateKey, 'testnet') // or sign it yourself
const keyPair = getKeyPairFromSignature(userSignature.signature)
const signedBody = SignOrderWithStarkKeys(keyPair, orderNonce.payload)
const order = await client.createNewOrder(signedBody)
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
import { WsClient } from 'brine-connector'
```

Create a new instance

```ts
const wsClient = new WsClient('public')
// or
const wsClient = new WsClient('public', null, 'testnet') // or 'mainnet'
// or
const loginRes = await client.completeLogin(ethAddress, ethPrivateKey)
const wsClient = new WsClient('private', loginRes.token.access)
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

// or fpr private

wsClient.subscribe(['trade', 'order'])
```

#### Unsubscribe

```ts
const streams = [
  'btcusdc.trades',
  'btcusdc.ob-inc',
  'btcusdc.kline-5m',
]
wsClient.unsubscribe(streams)

// or fpr private

wsClient.unsubscribe(['trade', 'order'])
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
import { isAuthenticationError } from 'brine-connector'
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

