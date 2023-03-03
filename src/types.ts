import { AxiosInstance } from 'axios'

export interface IClient {
  axiosInstance: AxiosInstance
  setToken: (token: string) => void

  testConnection: () => Promise<Response<string>>
  get24hPrice: (params: {
    market?: string
  }) => Promise<Response<FullDayPricePayload>>
  getCandlestick(
    params: CandleStickParams,
  ): Promise<Response<CandleStickPayload>>
  getOrderBook(params: OrderBookParams): Promise<Response<OrderBookPayload>>
  getRecentTrades(
    params: RecentTradesParams,
  ): Promise<Response<RecentTradesPayload>>

  completeLogin: (
    ethAddress: string,
    privateKey: string,
  ) => Promise<Response<LoginPayload>>
  getProfileInfo: () => Promise<Response<ProfileInformationPayload>>
}

export interface Response<T> {
  status: string
  message: string
  payload: T
}

export interface LoginPayload {
  uid: string
  token: {
    refresh: string
    access: string
  }
  signature?: string
}

export interface ProfileInformationPayload {
  name: string
  customer_id: string
  img: string | null
  username: string
  stark_key: string
}

export interface FullDayPricePayload {
  [market: string]: {
    at: string
    ticker: {
      at: string
      avg_price: string
      high: string
      last: string
      low: string
      open: string
      price_change_percent: string
      volume: string
      amount: string
    }
  }
}

export type CandleStickPayload = Array<
  [number, number, number, number, number, number]
>

export interface AskBid {
  id: number
  uuid: string
  side: string
  ord_type: string
  price: string | null
  avg_price: string
  state: string
  market: string
  created_at: string
  updated_at: string
  origin_volume: string
  remaining_volume: string
  executed_volume: string
  maker_fee: string
  taker_fee: string
  trades_count: number
}

export interface OrderBookPayload {
  asks: AskBid[]
  bid: AskBid[]
}

export interface RecentTradesPayload {
  id: number
  price: number
  amount: number
  total: number
  market: string
  created_at: number
  taker_type: string
}

export type ProfitAndLossPayload = {
  currency: string
  pnl_currency: string
  total_credit: string
  total_debit: string
  total_credit_value: string
  total_debit_value: string
  average_buy_price: string
  average_sell_price: string
  average_balance_price: string
  total_balance_value: string
}[]

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

export interface CreateOrderNonceBody {
  market: string
  ord_type: 'market' | 'limit'
  price?: number
  side: string
  volume: number | 0.015
}

export interface CreateOrderNoncePayload {
  nonce: number
  msg_hash: string
}

export interface CreateNewOrderBody extends CreateOrderNoncePayload {
  signature: {
    r: string
    s: string
  }
}

export interface CreateNewOrderPayload {
  id: number
  uuid: string
  side: string
  ord_type: string
  price: string
  avg_price: string
  state: string
  market: string
  created_at: string
  updated_at: string
  origin_volume: string
  remaining_volume: string
  executed_volume: string
  maker_fee: string
  taker_fee: string
  trades_count: number
}
