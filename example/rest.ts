import { AxiosError } from 'axios'
import * as dotenv from 'dotenv'
import { CreateOrderNonceBody, Response } from '../src/types'
import { Client } from '../src/client'
import { isAuthenticationError } from '../src/error'
import {
  createUserSignature,
  generateKeyPairFromEthPrivateKey,
  getKeyPairFromSignature,
  signOrderNonceWithSignature,
  signOrderWithStarkKeys,
} from '../src'
import { Wallet, ethers } from 'ethers'

dotenv.config()

const main = async () => {
  // load your privateKey and walletAddress
  const privateKey = process.env.PRIVATE_KEY
  const ethAddress = process.env.ETH_ADDRESS
  // const brineOrganizationKey = process.env.BRINE_ORGANIZATION_KEY
  // const brineApiKey = process.env.BRINE_API_KEY

  if (privateKey && ethAddress) {
    // handle in try catch block
    try {
      // create a rest client instance (you can pass option)
      const client = new Client('mainnet')

      //you can use public endpoints right away
      const test = await client.testConnection()
      const candleStick = await client.get24hPrice()
      // login to use private endpoints
      const loginRes = await client.completeLogin(ethAddress, privateKey)
      console.log(loginRes.payload)

      // create an order nonce
      const nonceBody: CreateOrderNonceBody = {
        market: 'btcusdc',
        ord_type: 'market',
        price: 29580.51,
        side: 'buy',
        volume: 0.0001,
      }

      // create order (private)
      // const order = await client.createCompleteOrder(nonceBody, privateKey)

      // const orderNonce = await client.createOrderNonce(nonceBody)
      const userSignature = createUserSignature(privateKey, 'testnet') // or sign it yourself
      const keyPair = getKeyPairFromSignature(userSignature.signature)
      const stark_public_key = keyPair.getPublic().getX().toString('hex')
      const stark_private_key = keyPair.getPrivate().toString('hex')
      const provider = new ethers.providers.JsonRpcProvider(
        process.env.RPC_PROVIDER,
      )
      const signer = new Wallet(privateKey, provider)

      const res = await client.listFastWithdrawals({ page: 2 })
      console.log(res.payload)

      // console.log(res)
      // const res = await client.getTokenBalance(provider, ethAddress, 'btc')
      // console.log(res)
      // const res = await client.getTokenBalance(provider, ethAddress, 'btc')
      // console.log(balance)
      // console.log({
      //   stark_private_key,
      //   stark_public_key,
      // })
      // const keyPair = getKeyPairFromSignature(userSignature.signature)
      // const signedBody = signOrderWithStarkKeys(keyPair, orderNonce.payload)
      // const order = await client.createNewOrder({ ...signedBody })

      // console.log(order)
      // const orders = await client.listOrders()
      // console.log(orders.payload[0])

      // // get profile info (private)
      // const profile = await client.getProfileInfo()
      // console.log(profile.payload.username)
    } catch (e) {
      // Error: AuthenticationError | AxiosError
      if (isAuthenticationError(e)) {
        console.log(e)
      } else {
        console.log(e)

        console.log((e as AxiosError<Response<string>>)?.response?.data)
      }
    }
  }
}

// main()

const ethereumDepositAndWithdrawal = async () => {
  // load your privateKey and walletAddress
  const privateKey = process.env.PRIVATE_KEY
  const ethAddress = process.env.ETH_ADDRESS
  // const brineOrganizationKey = process.env.BRINE_ORGANIZATION_KEY
  // const brineApiKey = process.env.BRINE_API_KEY

  if (privateKey && ethAddress) {
    // handle in try catch block
    try {
      // create a rest client instance (you can pass option)
      const client = new Client('testnet')

      // login to use private endpoints
      const loginRes = await client.completeLogin(ethAddress, privateKey)
      console.log(loginRes.payload)

      const userSignature = createUserSignature(privateKey, 'testnet') // or sign it yourself
      const keyPair = getKeyPairFromSignature(userSignature.signature)
      const stark_public_key = keyPair.getPublic().getX().toString('hex')
      // const stark_private_key = keyPair.getPrivate().toString('hex')
      const provider = new ethers.providers.JsonRpcProvider(
        process.env.RPC_PROVIDER,
      )
      const signer = new Wallet(privateKey, provider)

      //  deposit with eth private key
      // const depositRes = await client.depositFromEthereumNetwork(
      //   process.env.RPC_PROVIDER as string,
      //   privateKey,
      //   'testnet',
      //   'eth',
      //   0.00001,
      // )
      //  or
      //  deposit with L2 Key
      // const depositStarkKeyRes =
      //   await client.depositFromEthereumNetworkWithStarkKey(
      //     signer,
      //     provider,
      //     `0x${stark_public_key}`,
      //     0.0001,
      //     'eth',
      //   )
      // Withdrawals
      // Normal withdrawal
      // 1. Initiate your withdrawal request by calling "initiateNormalWithdrawal".
      const withdrawalRes = await client.initiateNormalWithdrawal(
        keyPair,
        0.0001,
        'usdc',
      )
      // 2. WAIT for up to 24 hours.
      // 3. Call the function "getPendingNormalWithdrawalAmountByCoin" by passing the required parameter to check whether the withdrawn balance is pending.
      const pendingBalance =
        await client.getPendingNormalWithdrawalAmountByCoin(
          'eth',
          ethAddress,
          signer,
        )
      // 4. Final step - if you find the balance is more than 0, you can call "completeNormalWithdrawal" to withdraw the cumulative amount to your ETH wallet.
      const completeNWRes = await client.completeNormalWithdrawal(
        'eth',
        ethAddress,
        signer,
      )

      // Fast withdrawal
      const fastWithdrawalRes = await client.fastWithdrawal(
        keyPair,
        10,
        'usdc',
        'ETHEREUM',
      )

      //Get a list of deposit
      const depositsList = await client.listDeposits({
        page: 2,
        limit: 1,
        network: 'ETHEREUM',
      })

      //Get a list of withdrawals
      const withdrawalsList = await client.listNormalWithdrawals()

      //Get a list of fast withdrawals
      const fastwithdrawalsList = await client.listFastWithdrawals()

      console.log({
        // depositRes,
        // depositStarkKeyRes,
        withdrawalRes,
        pendingBalance,
        completeNWRes,
        // fastWithdrawalRes,
        depositsList,
        withdrawalsList,
        fastwithdrawalsList,
      })
    } catch (e) {
      // Error: AuthenticationError | AxiosError
      if (isAuthenticationError(e)) {
        console.log(e)
      } else {
        console.log(e)
        console.log((e as AxiosError<Response<string>>)?.response?.data)
      }
    }
  }
}

const polygonDepositAndWithdrawal = async () => {
  // load your privateKey and walletAddress
  const privateKey = process.env.PRIVATE_KEY
  const ethAddress = process.env.ETH_ADDRESS
  // const brineOrganizationKey = process.env.BRINE_ORGANIZATION_KEY
  // const brineApiKey = process.env.BRINE_API_KEY

  if (privateKey && ethAddress) {
    // handle in try catch block
    try {
      // create a rest client instance (you can pass option)
      const client = new Client('testnet')

      // login to use private endpoints
      const loginRes = await client.completeLogin(ethAddress, privateKey)
      console.log(loginRes.payload)

      const userSignature = createUserSignature(privateKey, 'testnet') // or sign it yourself
      const keyPair = getKeyPairFromSignature(userSignature.signature)

      const provider = new ethers.providers.JsonRpcProvider(
        process.env.RPC_PROVIDER,
      )
      const signer = new Wallet(privateKey, provider)

      // deposit with eth private key
      const deposit = await client.depositFromPolygonNetwork(
        process.env.RPC_PROVIDER as string,
        privateKey,
        'btc',
        '0.00001',
      )

      // const depositWithSigner =
      //   await client.depositFromPolygonNetworkWithSigner(
      //     signer,
      //     provider,
      //     'matic',
      //     0.0001,
      //   )

      const depositsList = await client.listDeposits({
        page: 2,
        limit: 1,
        network: 'POLYGON',
      })

      // // Fast withdrawal
      const fastWithdrawalRes = await client.fastWithdrawal(
        keyPair,
        0.001,
        'btc',
        'POLYGON',
      )

      // const fastwithdrawalsList = await client.listFastWithdrawals({
      //   page: 2, // This is an optional field
      //   network: 'POLYGON',
      // })

      console.log({
        depositFromPolygon: deposit,
        depositsList,
        fastWithdrawalRes,
      })
    } catch (e) {
      // Error: AuthenticationError | AxiosError
      if (isAuthenticationError(e)) {
        console.log(e)
      } else {
        console.log(e)
      }
    }
  }
}

// polygonDepositAndWithdrawal()
// ethereumDepositAndWithdrawal()

const internalTransfers = async () => {
  // load your privateKey and walletAddress
  const privateKey = process.env.PRIVATE_KEY
  const ethAddress = process.env.ETH_ADDRESS
  const brineOrganizationKey = process.env.BRINE_ORGANIZATION_KEY
  const brineApiKey = process.env.BRINE_API_KEY

  if (privateKey && ethAddress) {
    // handle in try catch block
    try {
      // create a rest client instance (you can pass option)
      const client = new Client('testnet')
      // login to use private endpoints
      const loginRes = await client.completeLogin(ethAddress, privateKey)
      console.log(loginRes.payload)

      // Getting the L2 keypair
      const keypair = generateKeyPairFromEthPrivateKey(privateKey, 'testnet') // default is mainnet

      // Executing the internalTransfer
      const internalTransferResponse =
        await client.initiateAndProcessInternalTransfers(
          keypair,
          brineOrganizationKey as string,
          brineApiKey as string,
          'usdc',
          1,
          '0xF5F467c3D86760A4Ff6262880727E854428a4996',
        )
      console.log({ internalTransferResponse })

      // Listing the internalTransfers
      const internalTransferList = await client.listInternalTransfers({
        limit: 10,
        offset: 10,
      })

      if (internalTransferList.payload.internal_transfers.length) {
        // Get the internal transfer by client ID
        const internalTransferById = await client.getInternalTransferByClientId(
          internalTransferList.payload.internal_transfers[0]
            .client_reference_id,
        )
        console.log(internalTransferById.payload)
      }
      // Check if a user exists by their destination address.
      const checkUserRes = await client.checkInternalTransferUserExists(
        brineOrganizationKey as string,
        brineApiKey as string,
        '0x6c875514E42F14B891399A6a8438E6AA8F77B178',
      )
    } catch (e) {
      console.log({ e })
      // Error: AuthenticationError | AxiosError
      if (isAuthenticationError(e)) {
        console.log(e)
      } else {
        console.log((e as AxiosError<Response<string>>)?.response?.data)
      }
    }
  }
}

// internalTransfers()


const getL2Keys = async (ethPrivateKey: string) => {

  const keypair = generateKeyPairFromEthPrivateKey(ethPrivateKey, 'mainnet') // default is mainnet

  const stark_public_key = keypair.getPublic().getX().toString('hex')
  const stark_private_key = keypair.getPrivate().toString('hex')

  console.log(`stark public_key ${stark_public_key}`)
  console.log(`stark private_key ${stark_private_key}`)
}

// getL2Keys("<enter your eth private key>")