import { AxiosError } from 'axios'
import * as dotenv from 'dotenv'
import { CreateOrderNonceBody, MAINNET, Response, TESTNET } from '../src/types'
import { Client } from '../src/client'
import { isAuthenticationError } from '../src/error'
import {
  createUserSignature,
  getKeyPairFromSignature,
  signOrderNonceWithSignature,
  signOrderWithStarkKeys,
} from '../src'
dotenv.config()

const main = async () => {
  // load your privateKey and walletAddress
  const privateKey = process.env.PRIVATE_KEY
  const ethAddress = process.env.ETH_ADDRESS

  if (privateKey && ethAddress) {
    // handle in try catch block
    try {
      // create a rest client instance (you can pass option)
      const client = new Client('testnet')

      //you can use public endpoints right away
      const test = await client.testConnection()
      const candleStick = await client.getCandlestick({
        market: 'ethusdc',
        period: 120,
      })

      // const loginRes = await client.completeLogin(ethAddress, privateKey)
      // console.log(loginRes.payload)
      client.setAccessToken(
        'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjc5MDQxOTg3LCJqdGkiOiIwZDQ3ZWJiMzU3NTA0MDQwYWQyMDVmODgxM2U4NGZlMSIsInVzZXJfaWQiOiJJREU5MjQ2RDUzRUYifQ.Rn8EpdPUaiwa0MmJNj2r7Xe-WAMyG72GOKWRps5QNtLyRdIWkLYq6uf3bUDreDJSZ4kgYEfQdmjWPSO9DZ9NeYGT9lLo3mSM32GsCB2s7rvzIkkJqpJrCiw_3WxgFNi4KF_4KqRUJeYtdwoRnTnOEY7rupcxyFIRXcFn3qYI-eUJZqjdY31POuKEJPsCJ1dGh6QX6CEgpsKHv7yfILAhz3He4lE4_ki4qUJC-MMR-UeAoBgLZyR59uSZQ5lwsYWSUs0lHydtpCPg4tKxhQQ11wRFJpxEkuJb7p8vRN6pu_jf3R5Jxi7YhddPCONNa3NVnKoaTQMyMt7FtPWCQVeMlcYTKkEQ2pRghYItKLOgTlwQkSkyGLA2LS9IIrQp22EUSsAzvSfSWECVabmxrplWc68cQctPYiHyQZiyPz_kEr37l6ioBVKGpFjAxE8ju1JW_RONn9EaH87I2RCQIBeCXnq8vqC5y5cFcw4HQ-OWoLmrTFhdYu7DpU65mPKT8AX6t0uPh9b_CpuAtNPTA0sc_5_ELPfGL1WEBMkCAjA6Hrk2JS72eTzNLxoeZ2o1pXBZCjtyG0zUNgUSl7kOrKcbhBRMj9hslei3jOsia5dZILQwN6OYxX5pCFH6FOE0GaSDcSzk05EV5pVZRnlvOakdtC1dnL0wGum5XoPN8dKoDV0',
      )

      client.setRefreshToken(
        'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTY4Mzg3MTM1OSwianRpIjoiOTQ4NTEwMGU0NTIxNDIxZTllYTc0YWQ5OTk2ODBjZDAiLCJ1c2VyX2lkIjoiSURFOTI0NkQ1M0VGIn0.aNQdkPocvjyYgS75eY4IEDu303FPUExaUJ2XAVN8R7297xSUiuwJXKBlt9V9pHc8wE4ycSgNHxgSY5wWmMn9M3_pYKSzGkvxWMAl1F7VEgb-HXIr86eRexx5UFz_rJwhHx1RGAN37qEM2u6YV9DpsKp-5w6Zn7e6RyEYkVXJRprz4XccED9tBIbQ-IdNfpICPJ85yxpM_K26H2O_vyuH2cp-x0B8tB6weDVrEn9IXemsjkUBiBVUonRB8x_ij-j21MwuyO_CXMkp_Zxn4n8yO4KC8BA187eSCeyHAQ1nraK5aB4bNKkjFFCZqkKA2lmH-4v1dcDVIZoMSWtstFFxFDIV4IhDFJSdp68J_m5pFdvJRzDWLAgS9OAzhp7Xh8oSj6QFjEFA2c83eLg3d8xiaVN_R2ANVnE2nHaibiJo-2Lq8Pdq1V5HhnGxOeSEk6M1Bg7IqgtRPsbMqKGS6wjxmZtqPmpXVFefN6i62NGBEQhGuJXBjbOYFiF0EFtybAqDExLZBwzFaAmD2zmW9sVrrILj8BuNC1Zw2uQsE5wDGQzsOZoqAf5WC2O9WSLMsAYfKN7KmfIMOsAcIX-lT8IanPmGjusTLrm2TXQT0U_Gb7VPi5vAHSueBrpLHFFVG1E6cNwrc-GZ3-NndpqvoOBApLaNXr0hIRkUo6F94mrAbeY',
      )

      // login to use private endpoints

      // create an order nonce
      const nonceBody: CreateOrderNonceBody = {
        market: TESTNET.markets.btcusdc,
        ord_type: 'market',
        price: 29580.51,
        side: 'buy',
        volume: 0.0001,
      }

      // create order (private)
      // const order = await client.createCompleteOrder(nonceBody, privateKey)

      // const orderNonce = await client.createOrderNonce(nonceBody)
      // const userSignature = createUserSignature(privateKey, 'testnet') // or sign it yourself
      // const keyPair = getKeyPairFromSignature(userSignature.signature)
      // const signedBody = signOrderWithStarkKeys(keyPair, orderNonce.payload)
      // const order = await client.createNewOrder(signedBody)

      // console.log(order)
      // const orders = await client.listOrders()
      // console.log(orders.payload[0])

      // get profile info (private)
      const profile = await client.getProfileInfo()
      console.log(profile.payload.username)

      const trades = await client.listTrades()
    } catch (e) {
      // Error: AuthenticationError | AxiosError
      if (isAuthenticationError(e)) {
        console.log(e)
      } else {
        console.log((e as AxiosError<Response<string>>)?.response?.data)
      }
    }
  }
}

main()
