import starkex_abi_main from './bin/starkex_abi_main.json'
import starkex_abi_test from './bin/starkex_abi_test.json'
import erc20Abi from './bin/erc20_abi.json'
import polygon_deposit_abi from './bin/polygon_deposit.json'

export const MAINNET = {
  markets: {
    ethusdc: 'ethusdc',
    btcusdc: 'btcusdc',
  },
} as const
export const TESTNET = {
  markets: {
    ethusdc: 'ethusdc',
    btcusdc: 'btcusdc',
    ethusdt: 'ethusdt',
    btcusdt: 'btcusdt',
  },
} as const

export const CONFIG = {
  ALLOWED_NETWORK_NAME_MAINNET: 'mainnet',
  ALLOWED_NETWORK_NAME_GOERLI: 'Goerli',
  ALLOWED_NETWORK_ID_MAINNET: 1,
  ALLOWED_NETWORK_ID_GOERLI: 5,
  ALLOWED_CHAIN_ID_MAINNET: '0x1',
  ALLOWED_CHAIN_ID_GOERLI: '0x5',
  STARK_CONTRACT: {
    mainnet: '0x1390f521A79BaBE99b69B37154D63D431da27A07',
    testnet: '0x87eB0b1B5958c7fD034966925Ea026ad8Bf3d6dD',
  },
  STARK_ABI: {
    mainnet: starkex_abi_main,
    testnet: starkex_abi_test,
  },
  POLYGON_ABI: polygon_deposit_abi,
  ERC20_ABI: erc20Abi,
}

export const MAX_INT_ALLOWANCE =
  '115792089237316195423570985008687907853269984665640564039457584007913129639935'
