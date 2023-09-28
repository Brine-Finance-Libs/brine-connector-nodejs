export type Market = 'ethusdc' | 'ethusdt' | 'btcusdc' | 'btcusdt'

export type Side = 'buy' | 'sell'
export type OrdType = 'market' | 'limit'
export type State = 'pending' | 'wait' | 'done' | 'cancel'
export type Network = 'mainnet' | 'testnet'

export interface Response<T> {
  status: string
  message: string
  payload: T
}

export type FullDayPricePayload = {
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

export interface CandleStickParams {
  market: string
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
  bids: AskBid[]
}

export interface OrderBookParams {
  market: string
  asks_limit?: number
  bids_limit?: number
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

export interface RecentTradesParams {
  market: string
  limit?: number
  timestamp?: number
  order_by?: 'asc' | 'desc'
}

export interface CreateOrderNonceBody {
  market: string
  ord_type: OrdType
  price: number
  side: Side
  volume: number
  organization_key?: string
  api_key?: string
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
  organization_key?: string
  api_key?: string
}

export interface Order {
  id: number
  uuid: string
  side: Side
  ord_type: OrdType
  price: string | null
  avg_price: string
  state: State
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

export interface StarkSignature {
  r: string
  s: string
  recoveryParam?: string | number
}

export interface InternalTransferKey {
  organization_key: string
  api_key: string
}

export interface InternalTransferInitiatePayload {
  msg_hash: string
  nonce: number
}

export interface InternalTransferInitiateBody extends InternalTransferKey {
  client_reference_id?: string
  currency: string
  amount: number
  destination_address: string
}

export interface InternalTransfer {
  client_reference_id: string
  amount: string
  currency: string
  from_address: string
  destination_address: string
  status: string
  created_at: string
  updated_at: string
}

export interface ListInternalTransferPayload {
  internal_transfers: InternalTransfer[]
  total_count: number
  limit: number
  offset: number
}

export interface InternalTransferProcessBody extends InternalTransferKey {
  signature: StarkSignature
  nonce: number
  msg_hash: string
}

export interface ListInternalTransferParams {
  limit?: number
  offset?: number
}

export interface CheckUserExistsBody extends InternalTransferKey {
  destination_address: string
}

export interface CheckUserExistsPayload {
  destination_address: string
  exists: boolean
}

export interface OrderPayload extends Order {
  trades?: []
}

export interface CancelOrder extends Omit<OrderPayload, 'id'> {
  order_id: number
}

export interface ListOrdersParams {
  limit?: number
  page?: number
  market?: string
  ord_type?: OrdType
  state?: State
  base_unit?: string
  quote_unit?: string
  start_time?: number
  end_time?: number
  side?: Side
  order_by?: 'asc' | 'desc'
}

export interface ListDepositParams {
  limit?: number
  page?: number
  network?: string
}

export interface ListWithdrawalParams {
  page?: number
  network?: string
}

export interface TradeParams {
  limit?: number
  page?: number
  market?: string
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
  market: string
  created_at: string
  taker_type: string
  side: Side
  order_id: number
}

export interface LoginPayload {
  uid: string
  signature?: string
}

export interface LoginResponse extends Response<LoginPayload> {
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
  deposit_address: string | null
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

export interface Sign {
  message: string
  messageHash?: string
  v: string
  r: string
  s: string
  signature: string
}

export interface CoinStat {
  [coinName: string]: {
    stark_asset_id: string
    quanitization: string
    token_contract: string
    decimal: string
    symbol: string
    blockchain_decimal: string
  }
}

export interface NetworkStat {
  [networkName: string]: {
    deposit_contract: string
    tokens: {
      [coinName: string]: {
        token_contract: string
        blockchain_decimal: string
      }
    }
    allowed_tokens_for_deposit: string[]
    allowed_tokens_for_fast_wd: string[]
  }
}

export interface NetworkCoinStat {
  deposit_contract: string
  allowed_tokens_for_deposit: string[]
  allowed_tokens_for_fast_wd: string[]
  tokens: {
    [coinName: string]: {
      token_contract: string
      blockchain_decimal: string
    }
  }
}

// Withdrawal types
export interface InitiateNormalWithdrawalResponse {
  nonce: string
  msg_hash: string
}

export interface InitiateFastWithdrawalResponse {
  fastwithdrawal_withdrawal_id: string
  msg_hash: string
}

export interface ValidateNormalWithdrawalResponse {
  id: string
  amount: string
  token_id: string
  created_at: string
  transaction_status: string
  extras?: any
}

export interface ProcessFastWithdrawalResponse {
  id: string
  amount: string
  fee_amount: string
  token_id: string
  created_at: string
  l1_withdrawal_blockchain_hash: string
  transaction_status: string
  extras?: any
}

export interface InitiateWithdrawalPayload {
  amount: number
  symbol: string
  network?: string
}

export interface ValidateNormalWithdrawalPayload {
  msg_hash: string
  signature: StarkSignature
  nonce: string | number
}

export interface ProcessFastWithdrawalPayload {
  msg_hash: string
  signature: StarkSignature
  fastwithdrawal_withdrawal_id?: string | number
}

export interface Deposit {
  token_id: string
  blockchain_deposit_status: string
  brine_deposit_status: string
  deposit_blockchain_hash: string
  amount: string
  created_at: string
}

export interface NormalWithdrawal {
  id: number
  amount: string
  token_id: string
  created_at: string
  transaction_status: string
  extras?: any
}

export interface FastWithdrawal {
  id: number
  amount: string
  fee_amount: string
  token_id: string
  created_at: string
  l1_withdrawal_blockchain_hash: string
  transaction_status: string
  extras?: any
}

export interface Pagination<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

// export interface DepositResponse extends {}
// export interface NormalResponse extends {}
// export interface FastWithdrawalResponse extends Pagination<FastWithdrawal> {}
