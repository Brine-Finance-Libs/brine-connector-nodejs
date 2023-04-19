import { AxiosInstance as AxiosInstanceType } from 'axios'
import {
  Balance,
  CancelOrder,
  CandleStickParams,
  CandleStickPayload,
  CreateNewOrderBody,
  CreateOrderNonceBody,
  CreateOrderNoncePayload,
  FullDayPricePayload,
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
import { signMsgHash } from './utils'

export class Client {
  axiosInstance: AxiosInstanceType
  getAuthStatus: () => void
  setToken: (token: string) => void
  private ethAddress?: string
  private userSignature?: string
  option: 'testnet' | 'mainnet'

  constructor(option: 'testnet' | 'mainnet' = 'testnet') {
    const baseURL =
      option === 'testnet'
        ? 'https://api-testnet.brine.fi'
        : 'https://api.brine.fi'
    const axios = new AxiosInstance(this.retryLogin, baseURL)
    this.axiosInstance = axios.axiosInstance
    this.setToken = axios.setToken
    this.getAuthStatus = axios.getAuthStatus
    this.option = option
  }

  retryLogin = async (): Promise<LoginResponse | undefined> => {
    if (this.ethAddress && this.userSignature)
      return await this.login(this.ethAddress, this.userSignature)
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
    this.setToken(loginRes.data.token.access)
    this.ethAddress = ethAddress
    this.userSignature = userSignature

    loginRes.data.payload.signature = userSignature

    return loginRes.data
  }

  async completeLogin(
    ethAddress: string,
    privateKey: string,
  ): Promise<LoginResponse> {
    const nonce = await this.getNonce(ethAddress)
    const signedMsg = signMsg(nonce.payload!, privateKey)
    const loginRes = await this.login(ethAddress, signedMsg.signature)

    return loginRes
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

  async listOrders(
    params?: ListOrdersParams,
  ): Promise<Response<OrderPayload[]>> {
    this.getAuthStatus()
    const res = await this.axiosInstance.get<Response<OrderPayload[]>>(
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
}
