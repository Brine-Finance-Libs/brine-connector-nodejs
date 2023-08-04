import axios, { AxiosInstance as AxiosInstanceType } from 'axios'
import {
  Balance,
  CancelOrder,
  CandleStickParams,
  CandleStickPayload,
  CoinStat,
  CreateNewOrderBody,
  CreateOrderNonceBody,
  CreateOrderNoncePayload,
  FullDayPricePayload,
  InternalTransfer,
  InternalTransferInitiateBody,
  InternalTransferInitiatePayload,
  InternalTransferProcessBody,
  ListInternalTransferParams,
  ListInternalTransferPayload,
  ListOrdersParams,
  LoginResponse,
  Market,
  Order,
  OrderBookParams,
  OrderBookPayload,
  OrderPayload,
  ProfileInformationPayload,
  ProfitAndLossPayload,
  RecentTradesParams,
  RecentTradesPayload,
  Response,
  TradeParams,
  TradePayload,
} from './types'
import { AxiosInstance } from './axiosInstance'
import { signMsg } from './bin/blockchain_utils'
import { getKeyPairFromSignature, sign } from './bin/signature'
import { signInternalTxMsgHash } from './utils'
import { ec } from 'elliptic'
import {
  approveUnlimitedAllowanceUtil,
  dequantize,
  filterCurrentCoin,
  get0X0to0X,
  getAllowance,
  getNonce,
  signMsgHash,
} from './utils'
import { Wallet, ethers } from 'ethers'
import { CONFIG } from './constants'
import {
  AllowanceTooLowError,
  BalanceTooLowError,
  CoinNotFoundError,
} from './error'

export class Client {
  axiosInstance: AxiosInstanceType
  getAuthStatus: () => void
  setToken: (token: string | null) => void
  setAccessToken: (token: string | null) => void
  setRefreshToken: (token: string | null) => void
  private refreshToken?: string | null
  private accessToken?: string | null
  option: 'testnet' | 'mainnet'

  constructor(option: 'mainnet' | 'testnet' = 'mainnet') {
    const baseURL =
      option === 'testnet'
        ? 'https://api-testnet.brine.fi'
        : 'https://api.brine.fi'
    const axios = new AxiosInstance(this.refreshTokens, baseURL)
    this.axiosInstance = axios.axiosInstance
    this.setAccessToken = (token: string | null) => {
      this.accessToken = token
      axios.setAccessToken(token)
    }
    this.setRefreshToken = (token: string | null) => {
      this.refreshToken = token
      axios.setRefreshToken(token)
    }
    this.setToken = axios.setAccessToken
    this.getAuthStatus = axios.getAuthStatus
    this.option = option
  }

  async testConnection(): Promise<Response<string>> {
    const res = await this.axiosInstance.get<Response<string>>(
      '/sapi/v1/health/',
    )
    return res.data
  }

  async get24hPrice(params?: {
    market?: Market
  }): Promise<Response<FullDayPricePayload>> {
    const res = await this.axiosInstance.get<Response<FullDayPricePayload>>(
      `/sapi/v1/market/tickers/`,
      { params: params },
    )
    return res.data
  }

  async getCandlestick(
    params: CandleStickParams,
  ): Promise<Response<CandleStickPayload>> {
    const res = await this.axiosInstance.get<Response<CandleStickPayload>>(
      `/sapi/v1/market/kline/`,
      { params: params },
    )
    return res.data
  }

  async getOrderBook(
    params: OrderBookParams,
  ): Promise<Response<OrderBookPayload>> {
    const res = await this.axiosInstance.get<Response<OrderBookPayload>>(
      `/sapi/v1/market/orderbook/`,
      { params: params },
    )
    return res.data
  }

  async getRecentTrades(
    params: RecentTradesParams,
  ): Promise<Response<RecentTradesPayload[]>> {
    const res = await this.axiosInstance.get<Response<RecentTradesPayload[]>>(
      `/sapi/v1/market/trades/`,
      { params: params },
    )
    return res.data
  }

  async getNonce(ethAddress: string): Promise<Response<string>> {
    const nonceRes = await this.axiosInstance.post<Response<string>>(
      '/sapi/v1/auth/nonce/',
      {
        eth_address: ethAddress,
      },
    )

    return nonceRes.data
  }

  async login(
    ethAddress: string,
    userSignature: string,
  ): Promise<LoginResponse> {
    const loginRes = await this.axiosInstance.post<LoginResponse>(
      '/sapi/v1/auth/login/',
      {
        eth_address: ethAddress,
        user_signature: userSignature,
      },
    )
    this.setAccessToken(loginRes.data.token.access)
    this.setRefreshToken(loginRes.data.token.refresh)

    loginRes.data.payload.signature = userSignature

    return loginRes.data
  }

  async completeLogin(
    ethAddress: string,
    privateKey: string,
  ): Promise<LoginResponse> {
    const nonce = await this.getNonce(ethAddress)
    const signedMsg = signMsg(nonce.payload, privateKey)
    const loginRes = await this.login(ethAddress, signedMsg.signature)

    return loginRes
  }

  async getVaultId(coin: string) {
    this.getAuthStatus()
    const res = await this.axiosInstance.post(`main/user/create_vault/`, {
      coin: coin,
    })
    return res.data
  }

  async getCoinStatus(): Promise<Response<CoinStat>> {
    const res = await this.axiosInstance.post(`/main/stat/v2/coins/`)
    return res.data
  }

  async approveUnlimitedAllowance(coin: string, signer: Wallet) {
    const { payload: coinStats } = await this.getCoinStatus()
    const currentCoin = filterCurrentCoin(coinStats, coin)
    const { token_contract: tokenContract } = currentCoin
    const starkContract =
      this.option === 'mainnet'
        ? CONFIG.STARK_CONTRACT_MAINNET
        : CONFIG.STARK_CONTRACT_GOERLI

    const res = await approveUnlimitedAllowanceUtil(
      starkContract,
      tokenContract,
      signer,
    )

    return res
  }

  async getTokenBalance(
    provider: ethers.providers.Provider,
    ethAddress: string,
    coin: string,
  ): Promise<number> {
    if (coin === 'eth') {
      const res = await provider.getBalance(ethAddress)
      return +ethers.utils.formatEther(res)
    }

    const { payload: coinStats } = await this.getCoinStatus()
    const currentCoin = filterCurrentCoin(coinStats, coin)
    const { token_contract: tokenContract, decimal } = currentCoin
    const contract = new ethers.Contract(
      tokenContract,
      CONFIG.ERC20_ABI,
      provider,
    )
    const balance = (await contract.balanceOf(ethAddress)).toString()
    const normalBalance = balance / Math.pow(10, +decimal)
    return normalBalance
  }

  async deposit(
    signer: Wallet,
    provider: ethers.providers.Provider,
    starkPublicKey: string,
    amount: string,
    coin: string,
  ) {
    this.getAuthStatus()
    const { payload: coinStats } = await this.getCoinStatus()
    const currentCoin = filterCurrentCoin(coinStats, coin)

    const {
      quanitization,
      decimal,
      token_contract: tokenContract,
      stark_asset_id: starkAssetId,
    } = currentCoin

    console.log({
      quanitization,
      decimal,
      token_contract: tokenContract,
      stark_asset_id: starkAssetId,
    })

    const quantizedAmount = ethers.utils.parseUnits(
      amount?.toString(),
      Number(quanitization),
    )

    const vault = await this.getVaultId(coin)
    const starkContract =
      this.option === 'mainnet'
        ? CONFIG.STARK_CONTRACT_MAINNET
        : CONFIG.STARK_CONTRACT_GOERLI
    const contract = new ethers.Contract(
      starkContract,
      CONFIG.ABI_FILE_TESTNET,
      signer,
    )
    const parsedAmount = ethers.utils.parseEther(amount)
    const gwei = ethers.utils.formatUnits(parsedAmount, 'gwei')

    const overrides = {
      value: parsedAmount,
      nonce: await getNonce(signer, provider),
    }

    const balance = await this.getTokenBalance(provider, signer.address, coin)

    if (balance < +amount) {
      throw new BalanceTooLowError(
        `Current Balance (${balance}) for '${coin}' is too low, please add balance before deposit`,
      )
    }

    let depositResponse
    if (coin === 'eth') {
      depositResponse = await contract.depositEth(
        starkPublicKey,
        starkAssetId,
        vault.payload.id,
        overrides,
      )
    } else {
      const allowance = await getAllowance(
        signer.address,
        starkContract,
        tokenContract,
        +decimal,
        provider,
      )
      console.log({ allowance, amount })
      if (allowance < +amount) {
        throw new AllowanceTooLowError(
          `Current Allowance (${allowance}) is too low, please use Client.approveUnlimitedAllowance()`,
        )
      }

      depositResponse = await contract.depositERC20(
        starkPublicKey,
        starkAssetId,
        vault.payload.id,
        quantizedAmount,
      )
    }

    const res = await this.cryptoDepositStart(
      coin === 'eth' ? +gwei * 10 : quantizedAmount.toString(),
      get0X0to0X(starkAssetId),
      get0X0to0X(starkPublicKey),
      depositResponse['hash'],
      depositResponse['nonce'],
      vault.payload.id,
    )

    return res
  }

  async cryptoDepositStart(
    amount: number | bigint | string,
    starkAssetId: string,
    starkPublicKey: string,
    depositBlockchainHash: string,
    depositBlockchainNonce: string,
    vaultId: number,
  ) {
    const res = await this.axiosInstance.post(`/main/payment/stark/start/`, {
      amount,
      token_id: starkAssetId,
      stark_key: starkPublicKey,
      deposit_blockchain_hash: depositBlockchainHash,
      deposit_blockchain_nonce: depositBlockchainNonce,
      vault_id: vaultId,
    })
    return res.data
  }

  async getProfileInfo(): Promise<Response<ProfileInformationPayload>> {
    this.getAuthStatus()
    const profileRes = await this.axiosInstance.get<
      Response<ProfileInformationPayload>
    >('/sapi/v1/user/profile/')
    return profileRes.data
  }

  async getBalance(params?: {
    currency?: string
  }): Promise<Response<Balance | Balance[]>> {
    this.getAuthStatus()
    const res = await this.axiosInstance.get<Response<Balance | Balance[]>>(
      '/sapi/v1/user/balance/',
      { params: params },
    )
    return res.data
  }

  async getProfitAndLoss(): Promise<Response<ProfitAndLossPayload>> {
    this.getAuthStatus()
    const res = await this.axiosInstance.get<Response<ProfitAndLossPayload>>(
      '/sapi/v1/user/pnl/',
    )
    return res.data
  }

  async createOrderNonce(
    body: CreateOrderNonceBody,
  ): Promise<Response<CreateOrderNoncePayload>> {
    this.getAuthStatus()
    const res = await this.axiosInstance.post<
      Response<CreateOrderNoncePayload>
    >('/sapi/v1/orders/nonce/', body)
    return res.data
  }

  async createCompleteOrder(
    nonce: CreateOrderNonceBody,
    privateKey: string,
  ): Promise<Response<Order>> {
    this.getAuthStatus()
    const nonceRes = await this.createOrderNonce(nonce)
    const signedMsg = signMsgHash(nonceRes.payload, privateKey, this.option)

    const order = await this.createNewOrder(signedMsg)
    return order
  }

  async createNewOrder(body: CreateNewOrderBody): Promise<Response<Order>> {
    this.getAuthStatus()
    const res = await this.axiosInstance.post<Response<Order>>(
      '/sapi/v1/orders/create/',
      body,
    )
    return res.data
  }

  async getOrder(orderId: number): Promise<Response<OrderPayload>> {
    this.getAuthStatus()
    const res = await this.axiosInstance.get<Response<OrderPayload>>(
      `/sapi/v1/orders/${orderId}`,
    )
    return res.data
  }

  async listOrders(params?: ListOrdersParams): Promise<Response<Order[]>> {
    this.getAuthStatus()
    const res = await this.axiosInstance.get<Response<Order[]>>(
      `/sapi/v1/orders`,
      { params: params },
    )
    return res.data
  }

  async cancelOrder(orderId: number): Promise<Response<CancelOrder>> {
    this.getAuthStatus()
    const res = await this.axiosInstance.post<
      Response<Omit<OrderPayload, 'id'> & { order_id: number }>
    >(`/sapi/v1/orders/cancel/`, { order_id: orderId })
    return res.data
  }

  async listTrades(params?: TradeParams): Promise<Response<TradePayload[]>> {
    this.getAuthStatus()
    const res = await this.axiosInstance.get<Response<TradePayload[]>>(
      `/sapi/v1/trades/`,
      { params: params },
    )
    return res.data
  }

  async initiateInternalTransfer(
    body: InternalTransferInitiateBody,
  ): Promise<Response<InternalTransferInitiatePayload>> {
    const res = await this.axiosInstance.post<
      Response<InternalTransferInitiatePayload>
    >('/sapi/v1/internal_transfers/initiate/', body)
    return res.data
  }

  async executeInternalTransfers(
    body: InternalTransferProcessBody,
  ): Promise<Response<InternalTransfer>> {
    const res = await this.axiosInstance.post<Response<InternalTransfer>>(
      '/sapi/v1/internal_transfers/process/',
      body,
    )
    return res.data
  }

  async initiateAndProcessInternalTransfers(
    keyPair: ec.KeyPair,
    organization_key: string,
    api_key: string,
    currency: string,
    amount: number,
    destination_address: string,
    client_transfer_id?: string,
  ): Promise<Response<InternalTransfer>> {
    this.getAuthStatus()
    const initiateResponse = await this.initiateInternalTransfer({
      organization_key,
      api_key,
      currency,
      amount,
      destination_address,
      client_transfer_id,
    })
    const signature = signInternalTxMsgHash(
      keyPair,
      initiateResponse.payload.msg_hash,
    )
    const executeResponse = await this.executeInternalTransfers({
      organization_key,
      api_key,
      signature,
      nonce: initiateResponse.payload.nonce,
      msg_hash: initiateResponse.payload.msg_hash,
    })
    return executeResponse
  }

  async listInternalTransfers(
    params?: ListInternalTransferParams,
  ): Promise<Response<ListInternalTransferPayload>> {
    this.getAuthStatus()
    const res = await this.axiosInstance.get<
      Response<ListInternalTransferPayload>
    >(`/sapi/v1/internal_transfers`, { params: params })
    return res.data
  }

  async getInternalTransferByClientId(
    client_reference_id: string,
  ): Promise<Response<InternalTransfer>> {
    this.getAuthStatus()
    const res = await this.axiosInstance.get<Response<InternalTransfer>>(
      `/sapi/v1/internal_transfers/${client_reference_id}`,
    )
    return res.data
  }

  refreshTokens = async (
    refreshToken?: string,
  ): Promise<Response<LoginResponse['token']> | undefined> => {
    if (refreshToken || this.refreshToken) {
      const res = await this.axiosInstance.post(
        '/sapi/v1/auth/token/refresh/',
        {
          refresh: refreshToken ?? this.refreshToken,
        },
      )

      this.setAccessToken(res.data.payload.access)
      this.setRefreshToken(res.data.payload.refresh)

      return res.data
    }
  }

  logOut = () => {
    this.setAccessToken(null)
    this.setRefreshToken(null)
  }
}
