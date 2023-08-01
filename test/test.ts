import { AxiosError } from 'axios'
import { expect } from 'chai'
import { Client } from '../src/client'
import { Balance, CreateOrderNonceBody, Response } from '../src/types'
import { AuthenticationError } from '../src/error'
import MockAdapter from 'axios-mock-adapter'
import { responses } from './mockResponses'

const brineOrganizationKey = process.env.BRINE_ORGANIZATION_KEY
const brineApiKey = process.env.BRINE_API_KEY

describe('Brine Connector', () => {
  describe('REST Client', () => {
    let client: Client
    let client2: Client
    let privateKey: string
    let ethAddress: string
    let mock1: MockAdapter
    let mock2: MockAdapter
    before(() => {
      privateKey =
        '7d6384d6877be027aa25bd458f2058e3f7ff68347dc583a9baf96f5f97b413a8'
      ethAddress = '0x713Cf80b7c71440E7a09Dede1ee23dCBf862fB66'
      client = new Client()
      client2 = new Client()
      mock1 = new MockAdapter(client.axiosInstance, {
        onNoMatch: 'throwException',
      })
      mock2 = new MockAdapter(client2.axiosInstance, {
        onNoMatch: 'throwException',
      })
    })

    describe('Ping', () => {
      it('Test Connection', async () => {
        mock1.onGet('/sapi/v1/health/').reply(200, responses.testConnection)

        const res = await client.testConnection()
        expect(res).to.have.property('payload')
        expect(res).to.have.property('status')
        expect(res.status).to.eql('success')
      })
    })

    describe('Market', () => {
      it('24hr Price', async () => {
        mock1.onGet('/sapi/v1/market/tickers/').reply(200, responses.market)
        const res = await client.get24hPrice({ market: 'ethusdc' })
        expect(res).to.have.property('payload')
        expect(res).to.have.property('status')
        expect(res.status).to.eql('success')
      })

      it('Kline/Candlestick Data', async () => {
        mock1.onGet('/sapi/v1/market/kline/').reply(200, responses.kline)
        const res = await client.getCandlestick({
          market: 'ethusdc',
          period: 120,
        })
        expect(res).to.have.property('payload')
        expect(res).to.have.property('status')
        expect(res.status).to.eql('success')
      })

      it('Kline/Candlestick 400', async () => {
        mock1
          .onGet('/sapi/v1/market/kline/')
          .reply(400, responses.klineInvalidMarketError)
        try {
          const res = await client.getCandlestick({
            market: 'test',
            period: 120,
          })
        } catch (e: unknown) {
          const data = (e as AxiosError<Response<string>>)?.response?.data
          if (data) {
            expect(data).to.have.property('status')
            expect(data.status).to.eql('error')
            expect(data.message).to.include('market')
          }
        }
      })

      it('Order Book', async () => {
        mock1
          .onGet('/sapi/v1/market/orderbook/')
          .reply(200, responses.orderBook)
        const res = await client.getOrderBook({
          market: 'ethusdc',
        })
        expect(res).to.have.property('payload')
        expect(res).to.have.property('status')
        expect(res.status).to.eql('success')
      })

      it('Order Book 400', async () => {
        mock1
          .onGet('/sapi/v1/market/orderbook/')
          .reply(400, responses.orderbookMarketError)
        try {
          // @ts-expect-error: javascript use-case
          const res = await client.getOrderBook({})
        } catch (e: unknown) {
          const data = (e as AxiosError<Response<string>>)?.response?.data
          if (data) {
            expect(data).to.have.property('status')
            expect(data.status).to.eql('error')
            expect(data.message).to.include('market')
          }
        }
      })

      it('Recent Trades', async () => {
        mock1
          .onGet('/sapi/v1/market/trades/')
          .reply(200, responses.recentTrades)
        const res = await client.getRecentTrades({
          market: 'ethusdc',
        })
        expect(res).to.have.property('payload')
        expect(res).to.have.property('status')
        expect(res.status).to.eql('success')
      })
    })

    describe('Account', () => {
      it('Login', async () => {
        mock1.onPost('/sapi/v1/auth/nonce/').reply(200, responses.loginNonce)
        mock1.onPost('/sapi/v1/auth/login/').reply(200, responses.login)
        const res = await client.completeLogin(ethAddress!, privateKey!)
        expect(res).to.not.be.an('undefined')
        expect(res).to.have.property('status')
        expect(res).to.have.property('payload')
        expect(res.status).to.eql('success')
      })

      it('Login Invalid Eth Address 400', async () => {
        mock2
          .onPost('/sapi/v1/auth/nonce/')
          .reply(400, responses.loginInvalidEthAddress)
        try {
          const res = await client2.completeLogin('test', privateKey!)
        } catch (e) {
          const data = (e as AxiosError<Response<string>>)?.response?.data
          if (data) {
            expect(data).to.have.property('status')
            expect(data.status).to.eql('error')
            expect(data.message).to.include('characters')
          }
        }
      })

      it('Login Incorrect Address 400', async () => {
        mock2
          .onPost('/sapi/v1/auth/login/')
          .reply(200, responses.loginIncorrectAddress)
        try {
          const res = await client.completeLogin(
            '0x83D37295507F7C838f6a7dd1E41a4A81aC7C9a5E',
            privateKey!,
          )
        } catch (e) {
          const data = (e as AxiosError<Response<string>>)?.response?.data
          if (data) {
            expect(data).to.have.property('status')
            expect(data.status).to.eql('error')
            expect(data.message).to.include('login')
          }
        }
      })

      it('Profile Information', async () => {
        mock1
          .onGet('/sapi/v1/user/profile/')
          .reply(200, responses.profileInformation)
        const res = await client.getProfileInfo()
        expect(res).to.not.be.an('undefined')
        expect(res).to.have.property('status')
        expect(res).to.have.property('payload')
        expect(res.payload).to.have.property('stark_key')
        expect(res.status).to.eql('success')
      })

      it('Balance details', async () => {
        mock1
          .onGet('/sapi/v1/user/balance/')
          .reply(200, responses.balanceDetails)
        const res = await client.getBalance()
        expect(res).to.not.be.an('undefined')
        expect(res).to.have.property('status')
        expect(res).to.have.property('payload')
        expect((res as Response<Balance[]>).payload[0]).to.deep.property(
          'currency',
        )
        expect(res.status).to.eql('success')
      })

      it('Balance details Expired Access Token', async () => {
        mock1
          .onGet('/sapi/v1/user/balance/', undefined, {
            Authorization: `JWT ${responses.login.token.access}`,
          })
          .reply(401, responses.accessTokenExpired)
        mock1
          .onPost('/sapi/v1/auth/token/refresh/')
          .reply(200, responses.refreshToken)
        mock1
          .onGet('/sapi/v1/user/balance/', undefined, {
            Authorization: `JWT ${responses.refreshToken.payload.access}`,
          })
          .reply(200, responses.balanceDetails)
        const res = await client.getBalance()
        expect(res).to.not.be.an('undefined')
        expect(res).to.have.property('status')
        expect(res).to.have.property('payload')
        expect((res as Response<Balance[]>).payload[0]).to.deep.property(
          'currency',
        )
        expect(res.status).to.eql('success')
      })

      it('Profit and Loss Details', async () => {
        mock1.onGet('/sapi/v1/user/pnl/').reply(200, responses.profitAndLoss)
        const res = await client.getProfitAndLoss()
        expect(res).to.not.be.an('undefined')
        expect(res).to.have.property('status')
        expect(res).to.have.property('payload')
        expect(res.payload[0]).to.have.property('currency')
        expect(res.status).to.eql('success')
      })
    })

    describe('Trading', () => {
      describe('Create Order', () => {
        it('New Order Nonce', async () => {
          mock1
            .onPost('/sapi/v1/orders/nonce/')
            .reply(200, responses.orderNonce)
          const res = await client.createOrderNonce({
            market: 'btcusdt',
            ord_type: 'limit',
            price: 29580.51,
            side: 'sell',
            volume: 0.0001,
          })
          expect(res).to.have.property('status')
          expect(res.status).to.eql('success')
          expect(res).to.have.property('payload')
          expect(res.payload).to.have.property('nonce')
        })

        it('New Order Nonce 401', async () => {
          try {
            await client2.createOrderNonce({
              market: 'btcusdt',
              ord_type: 'limit',
              price: 29580.51,
              side: 'sell',
              volume: 0.0001,
            })
          } catch (e: unknown) {
            const data = e as AuthenticationError
            if (data) {
              expect(data).to.have.property('name')
              expect(data.name).to.eql('AuthenticationError')
            }
          }
        })

        it('New Order Nonce 400', async () => {
          mock1
            .onPost('/sapi/v1/orders/nonce/')
            .reply(400, responses.orderNonceDecimalError)
          try {
            await client.createOrderNonce({
              market: 'btcusdt',
              ord_type: 'limit',
              price: 29580.51,
              side: 'sell',
              volume: 0.00001,
            })
          } catch (e: unknown) {
            const data = (e as AxiosError<Response<string>>)?.response?.data
            if (data) {
              expect(data).to.have.property('status')
              expect(data.status).to.eql('error')
              expect(data.message).to.include('decimals')
            }
          }
        })

        it('Create New order', async () => {
          mock1
            .onPost('/sapi/v1/orders/nonce/')
            .reply(200, responses.orderNonce)
          mock1
            .onPost('/sapi/v1/orders/create/')
            .reply(200, responses.createOrder)
          const nonceBody: CreateOrderNonceBody = {
            market: 'btcusdt',
            ord_type: 'market',
            price: 29580.51,
            side: 'buy',
            volume: 0.0001,
          }
          await client.completeLogin(ethAddress!, privateKey!)
          const res = await client.createCompleteOrder(nonceBody, privateKey!)
          expect(res).to.have.property('status')
          expect(res.status).to.eql('success')
          expect(res).to.have.property('payload')
          expect(res.payload).to.have.property('id')
        })
      })

      it('List Orders', async () => {
        mock1.onGet('/sapi/v1/orders').reply(200, responses.listOrders)

        const listOrdersRes = await client.listOrders()
        expect(listOrdersRes).to.have.property('status')
        expect(listOrdersRes.status).to.eql('success')
        expect(listOrdersRes).to.have.property('payload')
        expect(listOrdersRes.payload[0]).to.have.property('uuid')
      })

      it('List Trades', async () => {
        mock1.onGet('/sapi/v1/trades/').reply(200, responses.listTrades)
        const res = await client.listTrades()
        expect(res).to.have.property('status')
        expect(res.status).to.eql('success')
        expect(res).to.have.property('payload')
        expect(res.payload[0]).to.have.property('id')
      })
    })
    describe('Internal Transfers', () => {
      describe('Initiate and Process Internal Transfers', () => {
        it('Initiate Internal Transfer - 200', async () => {
          mock1
            .onPost('/sapi/v1/internal_transfers/initiate/')
            .reply(200, responses.initiateInternalTransferResponse)
          const res = await client.initiateInternalTransfer({
            organization_key: brineOrganizationKey as string,
            api_key: brineApiKey as string,
            currency: 'usdc',
            amount: 1,
            destination_address: '0xF5F467c3D86760A4Ff6262880727E854428a4996',
          })
          expect(res).to.have.property('status')
          expect(res.status).to.eql('success')
          expect(res).to.have.property('payload')
          expect(res.payload).to.have.property('nonce')
        })

        it('Execute Internal Transfer - 200', async () => {
          mock1
            .onPost('/sapi/v1/internal_transfers/process/')
            .reply(200, responses.executeInternalTransferResponse)
          const res = await client.executeInternalTransfers({
            organization_key: brineOrganizationKey as string,
            api_key: brineApiKey as string,
            signature: {
              r: '0x12b9d57b59c621bb5de8e0803d1477a1697e66679811d51249038c17ac9d8ca',
              s: '0x4a5ff201e1c35fb59a0dc750eb1c2b7e0d57234e0e946698343c1d78c4277a',
            },
            nonce: 14214931,
            msg_hash:
              '0xda073d81fcf11f1312f2a722e1ff190f7ddb4c26f33adcc688726bce28b30d',
          })
          expect(res).to.have.property('status')
          expect(res.status).to.eql('success')
          expect(res).to.have.property('payload')
          expect(res.payload).to.have.property('client_reference_id')
          expect(res.payload).to.have.property('amount')
        })

        it('Initiate Internal Transfer - 403 Invalid credential', async () => {
          const clientId = 'random_id'
          mock1
            .onPost('/sapi/v1/internal_transfers/initiate/')
            .reply(403, responses.internalTransferResponseInvalidKey)
          try {
            const res = await client.getInternalTransferByClientId(clientId)
          } catch (e: unknown) {
            const data = (e as AxiosError<Response<string>>)?.response?.data
            if (data) {
              expect(data).to.have.property('status')
              expect(data.status).to.eql('error')
              expect(data.message).to.include('Invalid organization')
            }
          }
        })

        it('Execute Internal Transfer - 403 Invalid credential', async () => {
          const clientId = 'random_id'
          mock1
            .onPost('/sapi/v1/internal_transfers/process/')
            .reply(403, responses.internalTransferResponseInvalidKey)
          try {
            const res = await client.getInternalTransferByClientId(clientId)
          } catch (e: unknown) {
            const data = (e as AxiosError<Response<string>>)?.response?.data
            if (data) {
              expect(data).to.have.property('status')
              expect(data.status).to.eql('error')
              expect(data.message).to.include('Invalid organization')
            }
          }
        })

        it('Initiate Internal Transfer - 401 Invalid JWT', async () => {
          const clientId = 'random_id'
          mock1
            .onPost('/sapi/v1/internal_transfers/initiate/')
            .reply(403, responses.internalTransferResponseInvalidKey)
          try {
            const res = await client.getInternalTransferByClientId(clientId)
          } catch (e: unknown) {
            const data = (e as AxiosError<Response<string>>)?.response?.data
            if (data) {
              expect(data).to.have.property('status')
              expect(data.status).to.eql('error')
              expect(data.message).to.include('Invalid organization')
            }
          }
        })

        it('Execute Internal Transfer - 401 Invalid JWT', async () => {
          const clientId = 'random_id'
          mock1
            .onPost('/sapi/v1/internal_transfers/process/')
            .reply(403, responses.internalTransferResponseInvalidKey)
          try {
            const res = await client.getInternalTransferByClientId(clientId)
          } catch (e: unknown) {
            const data = (e as AxiosError<Response<string>>)?.response?.data
            if (data) {
              expect(data).to.have.property('status')
              expect(data.status).to.eql('error')
              expect(data.message).to.include('Invalid organization')
            }
          }
        })
      })
      describe('List & Get By Client ID', () => {
        it('List Internal Transfers - 200', async () => {
          mock1
            .onGet('/sapi/v1/internal_transfers')
            .reply(200, responses.listInternalTransfers)
          const res = await client.listInternalTransfers()
          expect(res).to.have.property('status')
          expect(res.status).to.eql('success')
          expect(res).to.have.property('payload')
          expect(res.payload.internal_transfers[0]).to.have.property(
            'client_reference_id',
          )
        })
        it('Get Internal Transfer By Client Id  - 200', async () => {
          const clientId = '6883122327947226'
          mock1
            .onGet(`/sapi/v1/internal_transfers/${clientId}`)
            .reply(200, responses.getInternalTransfersById)
          const res = await client.getInternalTransferByClientId(clientId)
          expect(res).to.have.property('status')
          expect(res.status).to.eql('success')
          expect(res).to.have.property('payload')
          expect(res.payload).to.have.property('client_reference_id')
        })
        it('Transfer does not exist with the given ID - 404', async () => {
          const clientId = 'random_id'
          mock1
            .onGet('/sapi/v1/market/kline/')
            .reply(404, responses.getInternalTransfersByIdNotExist)
          try {
            const res = await client.getInternalTransferByClientId(clientId)
          } catch (e: unknown) {
            const data = (e as AxiosError<Response<string>>)?.response?.data
            if (data) {
              expect(data).to.have.property('status')
              expect(data.status).to.eql('error')
              expect(data.message).to.include('transfer does not exist')
            }
          }
        })
      })
    })
  })
})
