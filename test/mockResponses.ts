import { LoginResponse, Response } from '../src/types'

export const responses = {
  testConnection: {
    status: 'success',
    message: 'Working fine!',
    payload: '',
  },
  market: {
    status: 'success',
    message: 'Retrieval Successful',
    payload: {
      btcusdc: { at: '1681903275', ticker: [{}] },
      btcusdt: { at: '1681903275', ticker: [{}] },
      ethusdc: { at: '1681903275', ticker: [{}] },
      ethusdt: { at: '1681903275', ticker: [{}] },
      usdcusdt: { at: '1681903275', ticker: [{}] },
    },
  },
  kline: {
    status: 'success',
    message: 'Retrieval Successful',
    payload: [
      [1681689600, 2014.02, 2014.02, 2014.02, 2014.02, 0],
      [1681696800, 2014.02, 2014.02, 2014.02, 2014.02, 0],
      [1681704000, 2014.02, 2014.02, 2014.02, 2014.02, 0],
      [1681711200, 2014.02, 2014.02, 2014.02, 2014.02, 0.01],
      [1681718400, 2014.02, 2014.02, 2014.02, 2014.02, 0],
      [1681725600, 2014.02, 2014.02, 2014.02, 2014.02, 0],
      [1681732800, 2014.02, 2014.02, 2014.02, 2014.02, 0],
      [1681740000, 2014.02, 2014.02, 2014.02, 2014.02, 0],
      [1681747200, 2014.02, 2014.02, 2014.02, 2014.02, 0.1618],
      [1681754400, 2014.02, 2014.02, 2014.02, 2014.02, 0],
      [1681761600, 2014.02, 2014.02, 2014.02, 2014.02, 0.008400000000000001],
      [1681768800, 2014.02, 2014.02, 2014.02, 2014.02, 0],
      [1681776000, 2014.02, 2014.02, 2014.02, 2014.02, 0],
      [1681783200, 2014.02, 2014.02, 2014.02, 2014.02, 0],
      [1681790400, 2014.02, 2014.02, 2014.02, 2014.02, 0.1],
      [1681797600, 2014.02, 2014.02, 2014.02, 2014.02, 0.3694],
      [1681804800, 2014.02, 2014.02, 2014.02, 2014.02, 0.05],
      [1681812000, 2014.02, 2014.02, 2014.02, 2014.02, 0.0993],
      [1681819200, 2014.02, 2014.02, 2014.02, 2014.02, 0.015],
      [1681826400, 2014.02, 2014.02, 2014.02, 2014.02, 0.0066],
      [1681833600, 2014.02, 2014.02, 2014.02, 2014.02, 0],
      [1681840800, 2014.02, 2014.02, 2014.02, 2014.02, 0],
      [1681848000, 2014.02, 2014.02, 2014.02, 2014.02, 0.0005],
      [1681855200, 2014.02, 2014.02, 2014.02, 2014.02, 0],
      [1681862400, 2014.02, 2014.02, 2014.02, 2014.02, 0],
      [1681869600, 2014.02, 2014.02, 2014.02, 2014.02, 0],
      [1681876800, 2014.02, 2014.02, 2014.02, 2014.02, 0],
      [1681884000, 2014.02, 2014.02, 2014.02, 2014.02, 0.01],
      [1681891200, 2014.02, 2014.02, 2014.02, 2014.02, 0.0993],
      [1681898400, 2014.02, 2014.02, 2014.02, 2014.02, 0],
    ],
  },
  klineInvalidMarketError: {
    status: 'error',
    message: 'please enter a valid market',
    payload: '',
  },
  orderBook: {
    status: 'success',
    message: 'Retrieval Successful',
    payload: {
      asks: [
        {
          id: 100,
          uuid: '6f11fcb2-1ef5-4fe3-852d-c73ddc28a8d1',
          side: 'sell',
          ord_type: 'limit',
          price: '2000.0',
          avg_price: '0.0',
          state: 'wait',
          market: 'ethusdc',
          created_at: '2023-04-19T11:02:50+02:00',
          updated_at: '2023-04-19T11:02:51+02:00',
          origin_volume: '0.001',
          remaining_volume: '0.001',
          executed_volume: '0.0',
          maker_fee: '0.001',
          taker_fee: '0.001',
          trades_count: 0,
        },
        {
          id: 101,
          uuid: 'cfa116ff-d0d7-4e23-923b-a83541e9dcd6',
          side: 'sell',
          ord_type: 'limit',
          price: '2010.0',
          avg_price: '0.0',
          state: 'wait',
          market: 'ethusdc',
          created_at: '2023-04-19T11:02:57+02:00',
          updated_at: '2023-04-19T11:02:57+02:00',
          origin_volume: '0.001',
          remaining_volume: '0.001',
          executed_volume: '0.0',
          maker_fee: '0.001',
          taker_fee: '0.001',
          trades_count: 0,
        },
        {
          id: 102,
          uuid: 'c41dd9e3-a191-435b-8101-5d97f2519f80',
          side: 'sell',
          ord_type: 'limit',
          price: '2020.0',
          avg_price: '0.0',
          state: 'wait',
          market: 'ethusdc',
          created_at: '2023-04-19T11:03:04+02:00',
          updated_at: '2023-04-19T11:03:04+02:00',
          origin_volume: '0.001',
          remaining_volume: '0.001',
          executed_volume: '0.0',
          maker_fee: '0.001',
          taker_fee: '0.001',
          trades_count: 0,
        },
        {
          id: 103,
          uuid: '19e1cbda-35e7-4adb-af5d-ca3ee2e2f54a',
          side: 'sell',
          ord_type: 'limit',
          price: '2030.0',
          avg_price: '0.0',
          state: 'wait',
          market: 'ethusdc',
          created_at: '2023-04-19T11:03:11+02:00',
          updated_at: '2023-04-19T11:03:11+02:00',
          origin_volume: '0.001',
          remaining_volume: '0.001',
          executed_volume: '0.0',
          maker_fee: '0.001',
          taker_fee: '0.001',
          trades_count: 0,
        },
      ],
      bids: [
        {
          id: 94,
          uuid: '06755d51-fcee-4936-b847-2d4da33588ba',
          side: 'buy',
          ord_type: 'limit',
          price: '1990.0',
          avg_price: '0.0',
          state: 'wait',
          market: 'ethusdc',
          created_at: '2023-04-19T11:01:18+02:00',
          updated_at: '2023-04-19T11:01:18+02:00',
          origin_volume: '0.001',
          remaining_volume: '0.001',
          executed_volume: '0.0',
          maker_fee: '0.001',
          taker_fee: '0.001',
          trades_count: 0,
        },
        {
          id: 97,
          uuid: 'bbce1e15-8ef0-46f8-abd5-edb0a5023c36',
          side: 'buy',
          ord_type: 'limit',
          price: '1980.0',
          avg_price: '0.0',
          state: 'wait',
          market: 'ethusdc',
          created_at: '2023-04-19T11:02:22+02:00',
          updated_at: '2023-04-19T11:02:22+02:00',
          origin_volume: '0.001',
          remaining_volume: '0.001',
          executed_volume: '0.0',
          maker_fee: '0.001',
          taker_fee: '0.001',
          trades_count: 0,
        },
        {
          id: 98,
          uuid: '789a70fb-6c35-421e-8cf9-5a3093f29712',
          side: 'buy',
          ord_type: 'limit',
          price: '1970.0',
          avg_price: '0.0',
          state: 'wait',
          market: 'ethusdc',
          created_at: '2023-04-19T11:02:28+02:00',
          updated_at: '2023-04-19T11:02:28+02:00',
          origin_volume: '0.001',
          remaining_volume: '0.001',
          executed_volume: '0.0',
          maker_fee: '0.001',
          taker_fee: '0.001',
          trades_count: 0,
        },
        {
          id: 99,
          uuid: 'edfee394-3f6b-4c60-b6d5-7623d2b3562d',
          side: 'buy',
          ord_type: 'limit',
          price: '1960.0',
          avg_price: '0.0',
          state: 'wait',
          market: 'ethusdc',
          created_at: '2023-04-19T11:02:35+02:00',
          updated_at: '2023-04-19T11:02:35+02:00',
          origin_volume: '0.001',
          remaining_volume: '0.001',
          executed_volume: '0.0',
          maker_fee: '0.001',
          taker_fee: '0.001',
          trades_count: 0,
        },
      ],
    },
  },
  orderbookMarketError: {
    status: 'error',
    message: 'please provide market, market is a mandatory field',
    payload: '',
  },
  recentTrades: {
    status: 'success',
    message: 'Retrieval Successful',
    payload: [
      {
        id: 40,
        price: 1990,
        amount: 0.001,
        total: 1.99,
        market: 'ethusdc',
        created_at: 1681894870,
        taker_type: 'buy',
      },
      {
        id: 39,
        price: 1989,
        amount: 0.001,
        total: 1.989,
        market: 'ethusdc',
        created_at: 1681894706,
        taker_type: 'buy',
      },
      {
        id: 38,
        price: 2101,
        amount: 0.0002,
        total: 0.4202,
        market: 'ethusdc',
        created_at: 1681806276,
        taker_type: 'buy',
      },
      {
        id: 37,
        price: 2101,
        amount: 0.0002,
        total: 0.4202,
        market: 'ethusdc',
        created_at: 1681805047,
        taker_type: 'sell',
      },
      {
        id: 35,
        price: 2105,
        amount: 0.0005,
        total: 1.0525,
        market: 'ethusdc',
        created_at: 1681804076,
        taker_type: 'sell',
      },
      {
        id: 34,
        price: 2105,
        amount: 0.001,
        total: 2.105,
        market: 'ethusdc',
        created_at: 1681804013,
        taker_type: 'sell',
      },
    ],
  },
  loginNonce: {
    status: 'success',
    message: 'Nonce Acquired',
    payload:
      'You’re now signing into Brine, make sure the origin is https://trade.brine.fi (Login-code:fdsfadf)',
  },
  login: {
    status: 'success',
    message: 'Login Successful',
    payload: {
      uid: 'IDDAF4F5E3C7',
      signature: '',
    },
    token: {
      refresh: 'fdsfaf',
      access: 'dasfssdsc',
    },
  },
  loginInvalidEthAddress: {
    status: 'error',
    message: 'Ensure eth_address has at least 30 characters.',
    payload: '',
  },
  loginIncorrectAddress: {
    status: 'error',
    message: 'Invalid Credentials or Token Expired, Kindly login again.',
    payload: '',
  },
  profileInformation: {
    status: 'success',
    message: 'Successful',
    payload: {
      name: 'test',
      img: null,
      username: '0x',
      stark_key: '0x',
    },
  },
  balanceDetails: {
    status: 'success',
    message: 'Retrieved Successfully',
    payload: [
      { currency: 'btc', balance: '0.0', locked: '0.0' },
      { currency: 'eth', balance: '0.0', locked: '0.0' },
      { currency: 'usdc', balance: '0.0', locked: '0.0' },
    ],
  },
  accessTokenExpired: {
    status: 'error',
    message: 'Given token not valid for any token type',
    payload: {
      token_class: 'AccessToken',
      token_type: 'access',
      message: 'Token is invalid or expired',
      code: 'token_not_valid',
    },
  },
  refreshToken: {
    status: 'success',
    message: '',
    payload: {
      access: 'ferasdfklre',
      refresh: 'fekcjicbd',
    },
  },
  profitAndLoss: {
    status: 'success',
    message: 'Retrieval Successful',
    payload: [
      {
        currency: 'btc',
        pnl_currency: 'usdc',
        total_credit: '0.0130869',
        total_debit: '0.0016',
        total_credit_value: '285.894238581',
        total_debit_value: '35.90128',
        average_buy_price: '21845.83351145038167938931',
        average_sell_price: '22438.3',
        average_balance_price: '22144.2931204690672853',
        total_balance_value: '254.369280645516129',
      },
      {
        currency: 'eth',
        pnl_currency: 'usdc',
        total_credit: '0.4899',
        total_debit: '0.2719825',
        total_credit_value: '716.668361',
        total_debit_value: '396.6192377',
        average_buy_price: '1462.88704021228822208614',
        average_sell_price: '1458.25278354305883650603',
        average_balance_price: '1514.9638440142855943',
        total_balance_value: '330.137133477983081',
      },
      {
        currency: 'usdc',
        pnl_currency: 'usdc',
        total_credit: '230.207937624',
        total_debit: '173.8537',
        total_credit_value: '230.207937624',
        total_debit_value: '173.8537',
        average_buy_price: '1.0',
        average_sell_price: '1.0',
        average_balance_price: '1.0',
        total_balance_value: '56.354237624',
      },
    ],
  },
  orderNonce: {
    status: 'success',
    message:
      'order nonce created successfully, please sign the msg_hash to place the order',
    payload: {
      nonce: 37355310,
      msg_hash:
        '0xfcbccbc483d23905e8a74225ce7dbba8ba7765a2b25e465d372b645c4c94fa',
    },
  },
  orderNonceDecimalError: {
    status: 'error',
    message: 'Maximum decimals allowed for volume is 4 in btcusdt market',
    payload: '',
  },
  createOrder: {
    status: 'success',
    message: 'Created Order Successfully',
    payload: {
      id: 37270840,
      uuid: 'd541658d-9559-43dc-ac39-e97ad0e5a454',
      side: 'buy',
      ord_type: 'market',
      price: null,
      avg_price: '0.0',
      state: 'pending',
      market: 'btcusdt',
      created_at: '2023-04-20T09:44:38+02:00',
      updated_at: '2023-04-20T09:44:38+02:00',
      origin_volume: '0.0001',
      remaining_volume: '0.0001',
      executed_volume: '0.0',
      maker_fee: '0.001',
      taker_fee: '0.001',
      trades_count: 0,
    },
  },
  listOrders: {
    status: 'success',
    message: 'Orders Retrieved Successfully',
    payload: [
      {
        id: 37270841,
        uuid: 'c553d4d0-a07e-46e5-a412-3322807d2632',
        side: 'buy',
        ord_type: 'market',
        price: null,
        avg_price: '30690.04',
        state: 'done',
        market: 'btcusdt',
        created_at: '2023-04-20T09:45:39+02:00',
        updated_at: '2023-04-20T09:45:39+02:00',
        origin_volume: '0.0001',
        remaining_volume: '0.0',
        executed_volume: '0.0001',
        maker_fee: '0.001',
        taker_fee: '0.001',
        trades_count: 1,
      },
    ],
  },
  listTrades: {
    status: 'success',
    message: 'Trades Retrieved Successfully',
    payload: [
      {
        id: 478272,
        price: '30690.04',
        amount: '0.0001',
        total: '3.069004',
        market: 'btcusdt',
        created_at: '2023-04-20T09:45:39+02:00',
        taker_type: 'buy',
        side: 'buy',
        order_id: 37270841,
        fee_currency: 'btc',
        fee: '0.001',
        fee_amount: '0.0000001',
      },
    ],
  },
  initiateInternalTransferResponse: {
    status: 'success',
    message: 'Please sign the message, to complete the transaction',
    payload: {
      nonce: 797982128,
      msg_hash:
        '0x2af4af1aa1e47a8b4d71a111a0b5a0649d80d586090548f7bb5a7ba74c287d3',
    },
  },
  internalTransferResponseInvalidKey: {
    status: 'error',
    message: 'Invalid organization key',
    payload: '',
  },
  internalTransferResponseInvalidJWT: {
    status: 'error',
    message: 'Authentication credentials were not provided.',
    payload: '',
  },
  executeInternalTransferResponse: {
    status: 'success',
    message: 'Internal transfer processed successfully',
    payload: {
      client_reference_id: '6462569061361987',
      amount: '1.0000000000000000',
      currency: 'usdc',
      from_address: '0x6c875514E42F14B891399A6a8438E6AA8F77B178',
      destination_address: '0xF5F467c3D86760A4Ff6262880727E854428a4996',
      status: 'success',
      created_at: '2023-07-26T06:28:52.350343Z',
      updated_at: '2023-07-26T06:28:52.902831Z',
    },
  },
  listInternalTransfers: {
    status: 'success',
    message: 'Fetched internal transfers successfully',
    payload: {
      internal_transfers: [
        {
          client_reference_id: '3845010178310545',
          amount: '1.0000000000000000',
          currency: 'usdc',
          from_address: '0x6c875514E42F14B891399A6a8438E6AA8F77B178',
          destination_address: '0xF5F467c3D86760A4Ff6262880727E854428a4996',
          status: 'success',
          created_at: '2023-07-26T05:11:47.285117Z',
          updated_at: '2023-07-26T05:11:47.698994Z',
        },
        {
          client_reference_id: '4645497856683096',
          amount: '1.0000000000000000',
          currency: 'usdc',
          from_address: '0x6c875514E42F14B891399A6a8438E6AA8F77B178',
          destination_address: '0xF5F467c3D86760A4Ff6262880727E854428a4996',
          status: 'success',
          created_at: '2023-07-26T05:11:13.502647Z',
          updated_at: '2023-07-26T05:11:14.047787Z',
        },
      ],
      total_count: 26,
      limit: 2,
      offset: 0,
    },
  },
  getInternalTransfersById: {
    status: 'success',
    message: 'Fetched internal transfer successfully',
    payload: {
      client_reference_id: '6883122327947226',
      amount: '1.0000000000000000',
      currency: 'usdc',
      from_address: '0x6c875514E42F14B891399A6a8438E6AA8F77B178',
      destination_address: '0xF5F467c3D86760A4Ff6262880727E854428a4996',
      status: 'success',
      created_at: '2023-07-26T05:16:31.557629Z',
      updated_at: '2023-07-26T05:16:32.047285Z',
    },
  },
  getInternalTransfersByIdNotExists: {
    status: 'error',
    message: 'Transfer does not exist',
    payload: '',
  },
  checkUserExists: {
    status: 'success',
    message: 'User exists',
    payload: {
      destination_address: '0xF5F467c3D86760A4Ff6262880727E854428a4996',
      exists: true,
    },
  },
  checkUserNotExists: {
    status: 'error',
    message: 'User does not exist',
    payload: {
      destination_address: '0xF5F467c3D86760A4Ff6262880727E854428s4996',
      exists: false,
    },
  },
  depositFromEthereumNetworkStartResponse: {
    status: 'success',
    message: 'Success! Awaiting Blockchain Confirmation',
    payload: '',
  },
  depositFromEthereumNetworkStartMissingParameters: {
    status: 'error',
    message: 'Essential parameters are missing',
    payload: '',
  },
  listDepositsResponse: {
    status: 'success',
    message: '',
    payload: {
      count: 493,
      next: '',
      previous: null,
      results: [
        {
          token_id:
            '0x2705737cd248ac819034b5de474c8f0368224f72a0fda9e031499d519992d9e',
          blockchain_deposit_status: 'Pending',
          brine_deposit_status: 'Pending',
          deposit_blockchain_hash:
            '0x6dacf57358e59018d5202e78ea5fb5a81ccd8741c524ca712e16f14e55b31ec2',
          amount: '100',
          created_at: '2023-08-07T04:29:57.732857Z',
        },
        {
          token_id:
            '0x2705737cd248ac819034b5de474c8f0368224f72a0fda9e031499d519992d9e',
          blockchain_deposit_status: 'Pending',
          brine_deposit_status: 'Pending',
          deposit_blockchain_hash:
            '0xbf41fa3a08446f5a8041fa7a3c80b3e2437a5f102de6d537e1cd9dc9b9258a87',
          amount: '100000',
          created_at: '2023-08-07T04:28:37.996150Z',
        },
        {
          token_id:
            '0x2705737cd248ac819034b5de474c8f0368224f72a0fda9e031499d519992d9e',
          blockchain_deposit_status: 'Pending',
          brine_deposit_status: 'Pending',
          deposit_blockchain_hash:
            '0x3e21ef7e8cd5cb3ebab7fe755d732f17ebc6f2ae5c8a9e1cae2b71ffb162a0aa',
          amount: '100',
          created_at: '2023-08-07T04:27:12.461843Z',
        },
        {
          token_id:
            '0x2705737cd248ac819034b5de474c8f0368224f72a0fda9e031499d519992d9e',
          blockchain_deposit_status: 'Failed',
          brine_deposit_status: 'Pending',
          deposit_blockchain_hash:
            '0xde7bdb6b221f09c066682da04c413eab89f71c08a4f629efee4c1e38eb2fca54',
          amount: '100',
          created_at: '2023-08-07T04:26:33.142663Z',
        },
        {
          token_id:
            '0x2705737cd248ac819034b5de474c8f0368224f72a0fda9e031499d519992d9e',
          blockchain_deposit_status: 'Success',
          brine_deposit_status: 'Success',
          deposit_blockchain_hash:
            '0x0531e0192df925f5d3d9de3333c699a01228ee8e636e5900ea03546ea4f8a35e',
          amount: '100',
          created_at: '2023-08-07T04:24:50.528657Z',
        },
        {
          token_id:
            '0x2705737cd248ac819034b5de474c8f0368224f72a0fda9e031499d519992d9e',
          blockchain_deposit_status: 'Success',
          brine_deposit_status: 'Success',
          deposit_blockchain_hash:
            '0x6789e1aa8db08a697e88381788503ea8e5714a3d59d524a84f619585cb56ace5',
          amount: '100000',
          created_at: '2023-08-07T04:16:37.757650Z',
        },
        {
          token_id:
            '0x2705737cd248ac819034b5de474c8f0368224f72a0fda9e031499d519992d9e',
          blockchain_deposit_status: 'Success',
          brine_deposit_status: 'Success',
          deposit_blockchain_hash:
            '0x24e2dd84b19410a59a00440794f6a70e111ec4fa4a30e3827fdc5e4a000c5461',
          amount: '100000',
          created_at: '2023-08-04T16:30:51.278421Z',
        },
        {
          token_id:
            '0x2705737cd248ac819034b5de474c8f0368224f72a0fda9e031499d519992d9e',
          blockchain_deposit_status: 'Success',
          brine_deposit_status: 'Success',
          deposit_blockchain_hash:
            '0x1b83e88ef5a8f4ad8c2de83ea366474727c7e64b10f6b2d1e1f0a9911170af47',
          amount: '1000',
          created_at: '2023-08-04T16:29:01.481086Z',
        },
        {
          token_id:
            '0x2705737cd248ac819034b5de474c8f0368224f72a0fda9e031499d519992d9e',
          blockchain_deposit_status: 'Success',
          brine_deposit_status: 'Success',
          deposit_blockchain_hash:
            '0xa4f05745ac8653b1a94f52835a94800c72475f348052dd1584c3b71e6c4d12c1',
          amount: '1000',
          created_at: '2023-08-04T13:39:42.430514Z',
        },
        {
          token_id:
            '0x2705737cd248ac819034b5de474c8f0368224f72a0fda9e031499d519992d9e',
          blockchain_deposit_status: 'Success',
          brine_deposit_status: 'Success',
          deposit_blockchain_hash:
            '0x1e654643b696f33d54a05c2c5f17a104be8a0a17da2bcb7dc310459e0e7c3a52',
          amount: '1000',
          created_at: '2023-08-04T06:57:32.045140Z',
        },
      ],
    },
  },
  depositFromPolygonNetworkStartResponse: {
    status: 'success',
    message: 'Success! Awaiting Blockchain Confirmation',
    payload: {
      transaction_hash: '',
    },
  },
  depositFromPolygonNetworkStartMissingParameters: {
    status: 'error',
    message: 'Essential parameters are missing',
    payload: '',
  },
  listPolygonDeposits: {
    status: 'success',
    message: '',
    payload: {
      count: 23,
      next: 'http://api-testnet.brine.fi/sapi/v1/deposits/?limit=1&network=POLYGON&page=3',
      previous:
        'http://api-testnet.brine.fi/sapi/v1/deposits/?limit=1&network=POLYGON',
      results: [
        {
          token_id:
            '0x36823b9f4fa9bdbae9eecdef9f69432df22ad79e2f8fcf2d826a0f4ae15dd77',
          blockchain_deposit_status: 'Success',
          brine_deposit_status: 'SUCCESS',
          deposit_blockchain_hash:
            '0x2a868c8884b6b5f0f3b44c2ec6f4278b56652d33ad98bbb51cd45656e8bfc65e',
          network: 'POLYGON',
          amount: '100',
          created_at: '2023-08-16T06:53:31.761603Z',
        },
        {
          token_id:
            '0x36823b9f4fa9bdbae9eecdef9f69432df22ad79e2f8fcf2d826a0f4ae15dd77',
          blockchain_deposit_status: 'Success',
          brine_deposit_status: 'SUCCESS',
          deposit_blockchain_hash:
            '0x54c3505c612797ce01d11b73e7bb1238f4be292be6771cf2ea38cfb48353052c',
          network: 'POLYGON',
          amount: '100',
          created_at: '2023-08-16T06:53:20.098033Z',
        },
        {
          token_id:
            '0x36823b9f4fa9bdbae9eecdef9f69432df22ad79e2f8fcf2d826a0f4ae15dd77',
          blockchain_deposit_status: 'Success',
          brine_deposit_status: 'SUCCESS',
          deposit_blockchain_hash:
            '0x0edc159590c62769631ab92bae0fd1a20754444f471704fa40106226bc430a7e',
          network: 'POLYGON',
          amount: '100',
          created_at: '2023-08-16T06:37:40.229312Z',
        },
        {
          token_id:
            '0x36823b9f4fa9bdbae9eecdef9f69432df22ad79e2f8fcf2d826a0f4ae15dd77',
          blockchain_deposit_status: 'Success',
          brine_deposit_status: 'SUCCESS',
          deposit_blockchain_hash:
            '0x561122a3fefa8aa2e9cacd60874e3ee5cea58bbf562dc23f95c3f3f05727bdee',
          network: 'POLYGON',
          amount: '100',
          created_at: '2023-08-16T06:29:18.100068Z',
        },
        {
          token_id:
            '0x36823b9f4fa9bdbae9eecdef9f69432df22ad79e2f8fcf2d826a0f4ae15dd77',
          blockchain_deposit_status: 'Success',
          brine_deposit_status: 'SUCCESS',
          deposit_blockchain_hash:
            '0x539ba8330580add2723c76af88386f1d31e3b93315839b4eae7a174c5e59c2ed',
          network: 'POLYGON',
          amount: '100',
          created_at: '2023-08-16T06:28:21.778246Z',
        },
        {
          token_id:
            '0x36823b9f4fa9bdbae9eecdef9f69432df22ad79e2f8fcf2d826a0f4ae15dd77',
          blockchain_deposit_status: 'Success',
          brine_deposit_status: 'SUCCESS',
          deposit_blockchain_hash:
            '0xe032d2c9115b83d77d981cb77fac88207631bcf23cee0574b1ffbbe40685cada',
          network: 'POLYGON',
          amount: '100',
          created_at: '2023-08-16T06:01:51.446800Z',
        },
        {
          token_id:
            '0x36823b9f4fa9bdbae9eecdef9f69432df22ad79e2f8fcf2d826a0f4ae15dd77',
          blockchain_deposit_status: 'Success',
          brine_deposit_status: 'SUCCESS',
          deposit_blockchain_hash:
            '0xbb08968f78b81143066e13b995a588587dfafee9b1040f942858fd3e37080f4a',
          network: 'POLYGON',
          amount: '100',
          created_at: '2023-08-11T10:24:54.095723Z',
        },
        {
          token_id:
            '0x36823b9f4fa9bdbae9eecdef9f69432df22ad79e2f8fcf2d826a0f4ae15dd77',
          blockchain_deposit_status: 'Success',
          brine_deposit_status: 'SUCCESS',
          deposit_blockchain_hash:
            '0xe72d32666acf7aa3f1ade0bea4440ada3457a99b5d617f20e075ea06c49d6263',
          network: 'POLYGON',
          amount: '100',
          created_at: '2023-08-11T10:21:43.632555Z',
        },
        {
          token_id:
            '0x36823b9f4fa9bdbae9eecdef9f69432df22ad79e2f8fcf2d826a0f4ae15dd77',
          blockchain_deposit_status: 'Success',
          brine_deposit_status: 'SUCCESS',
          deposit_blockchain_hash:
            '0xf9a8ab38af7ccc694078b7622761e392964c1f32e76c44d723451cf27b90fcf7',
          network: 'POLYGON',
          amount: '100',
          created_at: '2023-08-11T10:19:43.389197Z',
        },
        {
          token_id:
            '0x36823b9f4fa9bdbae9eecdef9f69432df22ad79e2f8fcf2d826a0f4ae15dd77',
          blockchain_deposit_status: 'Success',
          brine_deposit_status: 'SUCCESS',
          deposit_blockchain_hash:
            '0x42e414638908dc566ee5fee6f3a5c8413da9ee5276ab33cfbd1fb4659a63ffab',
          network: 'POLYGON',
          amount: '100',
          created_at: '2023-08-11T10:18:43.681993Z',
        },
      ],
    },
  },
  initiateWithdrawalResponse: {
    status: 'success',
    message: 'successfully initiated withdrawal',
    payload: {
      nonce: 7819,
      msg_hash:
        '686148137588728084357640508492604406021032862346002124816784805415214096923',
    },
  },
  validateWithdrawalResponse: {
    status: 'success',
    message: 'successfully initiated withdrawal',
    payload: {
      id: 7819,
      amount: '0.0000100000000000',
      token_id: 'eth',
      created_at: '2023-08-07T05:12:50.012516Z',
      transaction_status: 'INITIATED',
      extras: {
        errors: [],
        exp_timestamp: 3997985,
        quantised_amount: 100000,
      },
    },
  },
  validateWithdrawalValidationFailed: {
    status: 'error',
    message: 'Withdrawal Validation Failed, please try again',
    payload: '',
  },
  initiateFastWithdrawalResponse: {
    status: 'success',
    message: 'successfully initiated withdrawal',
    payload: {
      fastwithdrawal_withdrawal_id: 1071,
      msg_hash: '0x6170a...',
    },
  },
  processFastWithdrawalResponse: {
    status: 'success',
    message: 'successfully processed withdrawal',
    payload: {
      id: 1071,
      amount: '10.0000000000000000',
      fee_amount: '20',
      token_id: 'usdc',
      created_at: '2023-08-07T05:32:15.371735Z',
      l1_withdrawal_blockchain_hash: '0xc9cda14...',
      transaction_status: 'TRANSFER_INITIATED',
      extras: {
        errors: [],
        exp_timestamp: 3997985,
        quantised_amount: 30000000,
      },
    },
  },
  processFWithdrawalValidationFailed: {
    status: 'error',
    message:
      'Fast-Withdrawal Validation Failed, Please initiate a new transaction',
    payload: '',
  },
  listWithdrawalsResponse: {
    status: 'success',
    message: '',
    payload: {
      count: 315,
      next: 'http://api-testnet.brine.fi/main/payment/withdrawals/?page=2',
      previous: null,
      results: [
        {
          id: 7817,
          amount: '20.0000000000000000',
          token_id: 'usdc',
          created_at: '2023-08-04T12:34:14.863865Z',
          transaction_status: 'CONFIRMING',
          extras: {
            errors: [],
            exp_timestamp: 3997985,
            quantised_amount: 20000000,
          },
        },
        {
          id: 7816,
          amount: '20.0000000000000000',
          token_id: 'usdc',
          created_at: '2023-08-04T11:11:06.828763Z',
          transaction_status: 'CONFIRMING',
          extras: {
            errors: [],
            exp_timestamp: 3997985,
            quantised_amount: 20000000,
          },
        },
        {
          id: 7815,
          amount: '20.0000000000000000',
          token_id: 'usdc',
          created_at: '2023-08-04T11:10:35.030033Z',
          transaction_status: 'FAILED',
          extras: {
            errors: ['NOT_VALIDATED'],
            exp_timestamp: 3997985,
            quantised_amount: 20000000,
          },
        },
        {
          id: 7814,
          amount: '20.0000000000000000',
          token_id: 'eth',
          created_at: '2023-08-04T10:42:12.537837Z',
          transaction_status: 'FAILED',
          extras: {
            errors: ['NOT_VALIDATED'],
            exp_timestamp: 3997985,
            quantised_amount: 200000000000,
          },
        },
        {
          id: 7813,
          amount: '0.0000100000000000',
          token_id: 'eth',
          created_at: '2023-08-04T10:30:30.232291Z',
          transaction_status: 'CONFIRMING',
          extras: {
            errors: [],
            exp_timestamp: 3997985,
            quantised_amount: 100000,
          },
        },
        {
          id: 7812,
          amount: '0.0000100000000000',
          token_id: 'eth',
          created_at: '2023-08-04T10:28:54.938646Z',
          transaction_status: 'CONFIRMING',
          extras: {
            errors: [],
            exp_timestamp: 3997985,
            quantised_amount: 100000,
          },
        },
        {
          id: 7811,
          amount: '0.0000100000000000',
          token_id: 'eth',
          created_at: '2023-08-04T10:27:48.480858Z',
          transaction_status: 'CONFIRMING',
          extras: {
            errors: [],
            exp_timestamp: 3997985,
            quantised_amount: 100000,
          },
        },
        {
          id: 7810,
          amount: '0.0000100000000000',
          token_id: 'eth',
          created_at: '2023-08-04T10:26:03.211778Z',
          transaction_status: 'FAILED',
          extras: {
            errors: ['HASH_MISMATCH'],
            exp_timestamp: 3997985,
            quantised_amount: 100000,
          },
        },
        {
          id: 7809,
          amount: '0.0000100000000000',
          token_id: 'eth',
          created_at: '2023-08-04T10:24:56.251147Z',
          transaction_status: 'FAILED',
          extras: {
            errors: ['HASH_MISMATCH'],
            exp_timestamp: 3997985,
            quantised_amount: 100000,
          },
        },
        {
          id: 7808,
          amount: '0.0000100000000000',
          token_id: 'eth',
          created_at: '2023-08-04T09:42:35.114010Z',
          transaction_status: 'CONFIRMING',
          extras: {
            errors: [],
            exp_timestamp: 3997985,
            quantised_amount: 100000,
          },
        },
      ],
    },
  },
  listFastWithdrawalsResponse: {
    status: 'success',
    message: '',
    payload: {
      count: 72,
      next: 'http://api-testnet.brine.fi/main/payment/fast-withdrawals/?page=2',
      previous: null,
      results: [
        {
          id: 1070,
          amount: '10.0000000000000000',
          fee_amount: '20',
          token_id: 'usdc',
          created_at: '2023-08-04T16:15:55.217867Z',
          l1_withdrawal_blockchain_hash:
            '0x1f207bbc02e4e56ae80a7391149149b5db559ee0a55632002aa56da0001be783',
          transaction_status: 'TRANSFER_INITIATED',
          extras: {
            errors: [],
            exp_timestamp: 3997985,
            quantised_amount: 30000000,
          },
        },
        {
          id: 1069,
          amount: '20.0000000000000000',
          fee_amount: '20',
          token_id: 'usdc',
          created_at: '2023-08-04T11:10:08.093921Z',
          l1_withdrawal_blockchain_hash:
            '0xbef26f1ef3298d6fe286f0fa1a439cfba886316bd31572b79052a853ac3d95d9',
          transaction_status: 'TRANSFER_INITIATED',
          extras: {
            errors: [],
            exp_timestamp: 3997985,
            quantised_amount: 40000000,
          },
        },
        {
          id: 1068,
          amount: '20.0000000000000000',
          fee_amount: '20',
          token_id: 'usdc',
          created_at: '2023-08-04T11:01:29.108031Z',
          l1_withdrawal_blockchain_hash:
            '0x7c961face213181233baf3b91f76ed0a83d5c7f42bfb6c4c7e690751dd042b68',
          transaction_status: 'TRANSFER_INITIATED',
          extras: {
            errors: [],
            exp_timestamp: 3997985,
            quantised_amount: 40000000,
          },
        },
        {
          id: 1067,
          amount: '20.0000000000000000',
          fee_amount: '20',
          token_id: 'usdc',
          created_at: '2023-08-04T10:55:52.283063Z',
          l1_withdrawal_blockchain_hash: '',
          transaction_status: 'FAILED',
          extras: {
            errors: ['SIGN_VERIFICATION_FAILED'],
            exp_timestamp: 3997985,
            quantised_amount: 40000000,
          },
        },
        {
          id: 1066,
          amount: '20.0000000000000000',
          fee_amount: '20',
          token_id: 'usdc',
          created_at: '2023-08-04T10:53:32.634445Z',
          l1_withdrawal_blockchain_hash: '',
          transaction_status: 'FAILED',
          extras: {
            errors: ['SIGN_VERIFICATION_FAILED'],
            exp_timestamp: 3997985,
            quantised_amount: 40000000,
          },
        },
        {
          id: 1065,
          amount: '20.0000000000000000',
          fee_amount: '20',
          token_id: 'usdc',
          created_at: '2023-08-04T10:45:16.189165Z',
          l1_withdrawal_blockchain_hash: '',
          transaction_status: 'FAILED',
          extras: {
            errors: ['SIGN_VERIFICATION_FAILED'],
            exp_timestamp: 3997985,
            quantised_amount: 40000000,
          },
        },
        {
          id: 1064,
          amount: '10.0000000000000000',
          fee_amount: '20',
          token_id: 'usdc',
          created_at: '2023-08-04T10:34:15.619665Z',
          l1_withdrawal_blockchain_hash:
            '0x2c7ef2a5e9eb765f13ecfa5ed8aa7aabe6564e7f6873d819e92e27ff9cd05abd',
          transaction_status: 'TRANSFER_INITIATED',
          extras: {
            errors: [],
            exp_timestamp: 3997985,
            quantised_amount: 30000000,
          },
        },
        {
          id: 1062,
          amount: '10.0000000000000000',
          fee_amount: '20',
          token_id: 'usdc',
          created_at: '2023-08-03T13:49:22.249541Z',
          l1_withdrawal_blockchain_hash:
            '0x297e64cf8a4df5e90c03219f7cadedae40ffa1488b1b193ad6fdcf7c293c51d1',
          transaction_status: 'TRANSFER_INITIATED',
          extras: {
            errors: [],
            exp_timestamp: 3997985,
            quantised_amount: 30000000,
          },
        },
        {
          id: 1061,
          amount: '10.0000000000000000',
          fee_amount: '20',
          token_id: 'usdc',
          created_at: '2023-08-03T13:47:49.957037Z',
          l1_withdrawal_blockchain_hash:
            '0x3e62316bfaa6b86364d23639872c75fdaa7c4b5ec25e24761dd6521b20b8acf1',
          transaction_status: 'TRANSFER_INITIATED',
          extras: {
            errors: [],
            exp_timestamp: 3997985,
            quantised_amount: 30000000,
          },
        },
        {
          id: 1060,
          amount: '10.0000000000000000',
          fee_amount: '20',
          token_id: 'usdc',
          created_at: '2023-08-03T13:45:06.889378Z',
          l1_withdrawal_blockchain_hash:
            '0xee879f5217ebc9895411517c2f6bd15bb5e8fc7549844dcf31f8a768303e0789',
          transaction_status: 'TRANSFER_INITIATED',
          extras: {
            errors: [],
            exp_timestamp: 3997985,
            quantised_amount: 30000000,
          },
        },
      ],
    },
  },
}
