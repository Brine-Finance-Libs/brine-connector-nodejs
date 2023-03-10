export type Market = 'ethusdc' | 'ethusdt' | 'btcusdc' | 'btcusdt'
export type Side = 'buy' | 'sell'
export type OrdType = 'market' | 'limit'
export type State = 'pending' | 'wait' | 'done' | 'cancel'

export interface Response<T> {
  status: string
  message: string
  payload: T
}

export type FullDayPricePayload = {
  [market in Market]: {
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

export interface CandleStickParams {
  market: Market
  limit?: number
  period?: 1 | 5 | 15 | 30 | 60 | 120 | 240 | 360 | 720 | 1440 | 4320 | 10080
  start_time?: number
  end_time?: number
}

export type CandleStickPayload = Array<
  [number, number, number, number, number, number]
>

export interface AskBid {
  id: number
  uuid: string
  side: Side
  ord_type: OrdType
  price: string | null
  avg_price: string
  state: State
  market: Market
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

export interface OrderBookParams {
  market: Market
  asks_limit?: number
  bids_limit?: number
}

export interface RecentTradesPayload {
  id: number
  price: number
  amount: number
  total: number
  market: Market
  created_at: number
  taker_type: string
}

export interface RecentTradesParams {
  market: Market
  limit?: number
  timestamp?: number
  order_by?: 'asc' | 'desc'
}

export interface CreateOrderNonceBody {
  market: Market
  ord_type: OrdType
  price: number
  side: Side
  volume: number
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

export interface Order {
  id: number
  uuid: string
  side: Side
  ord_type: OrdType
  price: string
  avg_price: string
  state: State
  market: Market
  created_at: string
  updated_at: string
  origin_volume: string
  remaining_volume: string
  executed_volume: string
  maker_fee: string
  taker_fee: string
  trades_count: number
}

export interface OrderPayload extends Order {
  trades?: []
}

export interface ListOrdersParams {
  limit?: number
  page?: number
  market?: Market
  ord_type?: OrdType
  state?: State
  base_unit?: string
  quote_unit?: string
  start_time?: number
  end_time?: number
  side?: Side
}

export interface TradeParams {
  limit?: number
  page?: number
  market?: Market
  start_time?: number
  end_time?: number
  order_by?: 'asc' | 'desc'
}

export interface TradePayload {
  id: number
  price: string
  amount: string
  total: string
  fee_currency: string
  fee: string
  fee_amount: string
  market: Market
  created_at: string
  taker_type: string
  side: Side
  order_id: number
}

export interface LoginPayload {
  uid: string
  signature?: string
}

export type LoginResponse = Response<LoginPayload> & {
  token: {
    refresh: string
    access: string
  }
}

export interface ProfileInformationPayload {
  name: string
  customer_id: string
  img: string | null
  username: string
  stark_key: string
}

export interface Balance {
  currency: string
  balance: string
  locked: string
  deposit_address: null
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
