import { AxiosError, AxiosInstance as AxiosInstanceType } from 'axios'
import {
  CandleStickParams,
  IClient,
  LoginPayload,
  OrderBookParams,
  ProfileInformation,
  RecentTradesParams,
  Response,
} from '../types'
import { AxiosInstance } from './axiosInstance'
import { signMsg } from './blockchain_utils'

const protectedRouteResponse: Response<string> = {
  message: 'This is a private endpoint... Please using login() first',
  status: 'error',
  payload: '',
}

export class Client implements IClient {
  axiosInstance: AxiosInstanceType
  getAuthStatus: () => boolean
  setToken: (token: string) => void

  constructor() {
    const axios = new AxiosInstance()
    this.axiosInstance = axios.axiosInstance
    this.setToken = axios.setToken
    this.getAuthStatus = axios.getAuthStatus
  }

  async testConnection() {
    try {
      const res = await this.axiosInstance.get<Response<string>>(
        '/sapi/v1/health/',
      )
      return res.data
    } catch (e) {
      return (e as AxiosError)?.response?.data as Response<string>
    }
  }

  async get24hPrice(params: { market: string }) {
    try {
      const res = await this.axiosInstance.get<Response<string>>(
        `/sapi/v1/market/tickers/`,
        { params: params },
      )
      return res.data
    } catch (e) {
      return (e as AxiosError)?.response?.data as Response<string>
    }
  }

  async getCandlestick(params: CandleStickParams) {
    try {
      const res = await this.axiosInstance.get<Response<string>>(
        `/sapi/v1/market/kline/`,
        { params: params },
      )
      return res.data
    } catch (e) {
      return (e as AxiosError)?.response?.data as Response<string>
    }
  }

  async getOrderBook(params: OrderBookParams) {
    try {
      const res = await this.axiosInstance.get<Response<string>>(
        `/sapi/v1/market/orderbook/`,
        { params: params },
      )
      return res.data
    } catch (e) {
      return (e as AxiosError)?.response?.data as Response<string>
    }
  }

  async getRecentTrades(params: RecentTradesParams) {
    try {
      const res = await this.axiosInstance.get<Response<string>>(
        `/sapi/v1/market/trades/`,
        { params: params },
      )
      return res.data
    } catch (e) {
      return (e as AxiosError)?.response?.data as Response<string>
    }
  }

  async login(ethAddress: string, privateKey: string) {
    try {
      const nonceRes = await this.axiosInstance.post<Response<string>>(
        '/sapi/v1/auth/nonce/',
        {
          eth_address: ethAddress,
        },
      )

      const signedMsg = signMsg(nonceRes.data.payload, privateKey)

      const loginRes = await this.axiosInstance.post<Response<LoginPayload>>(
        '/sapi/v1/auth/login/',
        {
          eth_address: ethAddress,
          user_signature: signedMsg.signature,
        },
      )

      // @ts-expect-error: the api response format is incorrect
      this.setToken(loginRes.data.token.access)

      return loginRes.data
    } catch (e: unknown) {
      return (e as AxiosError).response?.data as Response<string>
    }
  }

  async getProfileInfo() {
    const auth = this.getAuthStatus()
    if (!auth) return protectedRouteResponse
    try {
      const profileRes = await this.axiosInstance.get<
        Response<ProfileInformation>
      >('/sapi/v1/user/profile/')
      return profileRes.data
    } catch (e) {
      return (e as AxiosError).response?.data as Response<string>
    }
  }
}
