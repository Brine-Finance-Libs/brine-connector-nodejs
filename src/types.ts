import { AxiosInstance } from 'axios'

export interface IClient {
  axiosInstance: AxiosInstance
  testConnection: () => Promise<Response<string>>
  setToken: (token: string) => void
  login: (
    ethAddress: string,
    privateKey: string,
  ) => Promise<Response<LoginPayload | string>>
  getProfileInfo: () => Promise<Response<ProfileInformation | string>>
}

export interface Response<T> {
  status: 'success' | 'error'
  message: string
  payload: T
}

export interface LoginPayload {
  uid: string
  token: {
    refresh: string
    access: string
  }
}

export interface ProfileInformation {
  name: string
  customer_id: string
  img: string | null
  username: string
  stark_key: string
}

export interface CandleStickParams {
  market: string
  limit?: number
  period?: 1 | 5 | 15 | 30 | 60 | 120 | 240 | 360 | 720 | 1440 | 4320 | 10080
  start_time?: number
  end_time?: number
}

export interface OrderBookParams {
  market: string
  asks_limit?: number
  bids_limit?: number
}


export interface RecentTradesParams {
  market: string
  limit?: number
  timestamp?: number
  order_by?: string
}