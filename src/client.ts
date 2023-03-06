import { AxiosInstance as AxiosInstanceType } from 'axios'
import {
  Balance,
  CandleStickParams,
  CandleStickPayload,
  CreateNewOrderBody,
  Order,
  CreateOrderNonceBody,
  CreateOrderNoncePayload,
  FullDayPricePayload,
  ListOrdersParams,
  LoginPayload,
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
  Market,
} from '..'
import { AxiosInstance } from './axiosInstance'
import { signMsg } from './bin/blockchain_utils'
import { getKeyPairFromSignature, sign } from './bin/signature'

export class Client {
  axiosInstance: AxiosInstanceType
  getAuthStatus: () => void
  setToken: (token: string) => void
  private ethAddress?: string
  private userSignature?: string

  constructor(baseUrl?: string) {
    const axios = new AxiosInstance(this.retryLogin, baseUrl)
    this.axiosInstance = axios.axiosInstance
    this.setToken = axios.setToken
    this.getAuthStatus = axios.getAuthStatus
  }

  retryLogin = async () => {
    if (this.ethAddress && this.userSignature)
      return await this.login(this.ethAddress, this.userSignature)
  }

  async testConnection() {
    try {
      const res = await this.axiosInstance.get<Response<string>>(
        '/sapi/v1/health/',
      )
      return res.data
    } catch (e) {
      throw e
    }
  }

  async get24hPrice(params: { market?: Market }) {
    try {
      const res = await this.axiosInstance.get<Response<FullDayPricePayload>>(
        `/sapi/v1/market/tickers/`,
        { params: params },
      )
      return res.data
    } catch (e) {
      throw e
    }
  }

  async getCandlestick(params: CandleStickParams) {
    try {
      const res = await this.axiosInstance.get<Response<CandleStickPayload>>(
        `/sapi/v1/market/kline/`,
        { params: params },
      )
      return res.data
    } catch (e) {
      throw e
    }
  }

  async getOrderBook(params: OrderBookParams) {
    try {
      const res = await this.axiosInstance.get<Response<OrderBookPayload>>(
        `/sapi/v1/market/orderbook/`,
        { params: params },
      )
      return res.data
    } catch (e) {
      throw e
    }
  }

  async getRecentTrades(params: RecentTradesParams) {
    try {
      const res = await this.axiosInstance.get<Response<RecentTradesPayload>>(
        `/sapi/v1/market/trades/`,
        { params: params },
      )
      return res.data
    } catch (e) {
      throw e
    }
  }

  async getNonce(ethAddress: string) {
    try {
      const nonceRes = await this.axiosInstance.post<Response<string>>(
        '/sapi/v1/auth/nonce/',
        {
          eth_address: ethAddress,
        },
      )

      return nonceRes.data
    } catch (e: unknown) {
      throw e
    }
  }

  async login(ethAddress: string, userSignature: string) {
    try {
      const loginRes = await this.axiosInstance.post<Response<LoginPayload>>(
        '/sapi/v1/auth/login/',
        {
          eth_address: ethAddress,
          user_signature: userSignature,
        },
      )
      // @ts-expect-error
      this.setToken(loginRes.data.token.access)
      this.ethAddress = ethAddress
      this.userSignature = userSignature

      loginRes.data.payload.signature = userSignature

      return loginRes.data
    } catch (e: unknown) {
      throw e
    }
  }

  async completeLogin(ethAddress: string, privateKey: string) {
    try {
      const nonce = await this.getNonce(ethAddress)
      const signedMsg = signMsg(nonce.payload!, privateKey)
      const loginRes = await this.login(ethAddress, signedMsg.signature)

      return loginRes
    } catch (e: unknown) {
      throw e
    }
  }

  async getProfileInfo() {
    try {
      this.getAuthStatus()
      const profileRes = await this.axiosInstance.get<
        Response<ProfileInformationPayload>
      >('/sapi/v1/user/profile/')
      return profileRes.data
    } catch (e) {
      throw e
    }
  }

  async getBalance(params?: { currency?: string }) {
    try {
      this.getAuthStatus()
      const res = await this.axiosInstance.get<Response<Balance | Balance[]>>(
        '/sapi/v1/user/balance/',
        { params: params },
      )
      return res.data
    } catch (e) {
      throw e
    }
  }

  async getProfitAndLoss() {
    try {
      this.getAuthStatus()
      const res = await this.axiosInstance.get<Response<ProfitAndLossPayload>>(
        '/sapi/v1/user/pnl/',
      )
      return res.data
    } catch (e) {
      throw e
    }
  }

  async createOrderNonce(body: CreateOrderNonceBody) {
    try {
      this.getAuthStatus()
      const res = await this.axiosInstance.post<
        Response<CreateOrderNoncePayload>
      >('/sapi/v1/orders/nonce/', body)
      return res.data
    } catch (e) {
      throw e
    }
  }

  
  signMsgHash(nonce: CreateOrderNoncePayload, privateKey: string) {
    try {
      const msgToBeSigned = "Click sign to verify you're a human - Brine.finance"
      const userSignature = signMsg(msgToBeSigned, privateKey)
      const keyPair = getKeyPairFromSignature(userSignature.signature)
      const msg = sign(keyPair, nonce.msg_hash.replace('0x', ''))
      const createOrderBody: CreateNewOrderBody = {
        msg_hash: nonce.msg_hash,
        signature: {
          r: `0x${msg.r.toString('hex')}`,
          s: `0x${msg.s.toString('hex')}`,
        },
        nonce: nonce.nonce,
      }
      return createOrderBody
    } catch (e) {
      throw e
    }
  }

  async createCompleteOrder(nonce: CreateOrderNonceBody, privateKey: string) {
    try {
      this.getAuthStatus()
      const nonceRes = await this.createOrderNonce(nonce)
      const signedMsg = this.signMsgHash(nonceRes.payload, privateKey)
      const order = await this.createNewOrder(signedMsg)

      return order
    } catch (e) {
      throw e
    }
  }

  async createNewOrder(body: CreateNewOrderBody) {
    try {
      this.getAuthStatus()
      const res = await this.axiosInstance.post<Response<Order>>(
        '/sapi/v1/orders/create/',
        body,
      )
      return res.data
    } catch (e) {
      throw e
    }
  }

  async getOrder(orderId: number) {
    try {
      this.getAuthStatus()
      const res = await this.axiosInstance.post<Response<OrderPayload>>(
        `/sapi/v1/orders/${orderId}`,
      )
      return res.data
    } catch (e) {
      throw e
    }
  }

  async listOrders(params?: ListOrdersParams) {
    try {
      this.getAuthStatus()
      const res = await this.axiosInstance.post<Response<OrderPayload[]>>(
        `/sapi/v1/orders`,
        { params: params },
      )
      return res.data
    } catch (e) {
      throw e
    }
  }

  async cancelOrder(orderId: number) {
    try {
      this.getAuthStatus()
      const res = await this.axiosInstance.post<
        Response<Omit<OrderPayload, 'id'> & { order_id: number }>
      >(`/sapi/v1/orders/cancel/`, { order_id: orderId })
      return res.data
    } catch (e) {
      throw e
    }
  }

  async listTrades(params?: TradeParams) {
    try {
      this.getAuthStatus()
      const res = await this.axiosInstance.get<Response<TradePayload[]>>(
        `/sapi/v1/trades/`,
        { params: params },
      )
      return res.data
    } catch (e) {
      throw e
    }
  }
}
