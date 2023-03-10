import { AxiosError } from 'axios'
import { expect } from 'chai'
import { Client } from '../src/client'
import { Balance, CreateOrderNonceBody, Response } from '../src/types'
import { AuthenticationError } from '../src/error'

describe('Brine Wrapper', () => {
  describe('REST Client', () => {
    let client: Client
    let client2: Client
    let mockClient: Client
    let privateKey: string | undefined
    let ethAddress: string | undefined
    before(() => {
      privateKey = process.env.PRIVATE_KEY
      ethAddress = process.env.ETH_ADDRESS
      client = new Client()
      client2 = new Client()
      mockClient = new Client(
        'https://e0b41562-40df-4e2a-9629-bcd41f8fcdc1.mock.pstmn.io',
      )
    })

    describe('Ping', () => {
      it('Test Connection', async () => {
        const res = await client.testConnection()
        expect(res).to.have.property('payload')
        expect(res).to.have.property('status')
        expect(res.status).to.eql('success')
      })
    })

    describe('Market', () => {
      it('24hr Price', async () => {
        const res = await client.get24hPrice({ market: 'ethusdc' })
        expect(res).to.have.property('payload')
        expect(res).to.have.property('status')
        expect(res.status).to.eql('success')
      })

      it('Kline/Candlestick Data', async () => {
        const res = await client.getCandlestick({
          market: 'ethusdc',
          period: 120,
        })
        expect(res).to.have.property('payload')
        expect(res).to.have.property('status')
        expect(res.status).to.eql('success')
      })

      it('Kline/Candlestick 400', async () => {
        try {
          const res = await client.getCandlestick({
            // @ts-expect-error: javascript use-case
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
        const res = await client.getOrderBook({
          market: 'ethusdc',
        })
        expect(res).to.have.property('payload')
        expect(res).to.have.property('status')
        expect(res.status).to.eql('success')
      })

      it('Order Book 400', async () => {
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
        const res = await client.completeLogin(ethAddress!, privateKey!)
        expect(res).to.not.be.an('undefined')
        expect(res).to.have.property('status')
        expect(res).to.have.property('payload')
        expect(res.status).to.eql('success')
      })

      it('Login Invalid Eth Address 400', async () => {
        try {
          const client = new Client()
          const res = await client.completeLogin('test', privateKey!)
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
        try {
          const client = new Client()
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
        const res = await client.getProfileInfo()
        expect(res).to.not.be.an('undefined')
        expect(res).to.have.property('status')
        expect(res).to.have.property('payload')
        expect(res.payload).to.have.property('stark_key')
        expect(res.status).to.eql('success')
      })

      it('Balance details', async () => {
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
          const nonceBody: CreateOrderNonceBody = {
            market: 'btcusdt',
            ord_type: 'market',
            price: 29580.51,
            side: 'buy',
            volume: 0.0001,
          }
          await mockClient.completeLogin(ethAddress!, privateKey!)
          const res = await mockClient.createCompleteOrder(
            nonceBody,
            privateKey!,
          )
          expect(res).to.have.property('status')
          expect(res.status).to.eql('success')
          expect(res).to.have.property('payload')
          expect(res.payload).to.have.property('id')
        })
      })

      it('List Orders', async () => {
        const listOrdersRes = await client.listOrders()
        expect(listOrdersRes).to.have.property('status')
        expect(listOrdersRes.status).to.eql('success')
        expect(listOrdersRes).to.have.property('payload')
        expect(listOrdersRes.payload[0]).to.have.property('uuid')
      })

      it('List Trades', async () => {
        const res = await client.listTrades()
        expect(res).to.have.property('status')
        expect(res.status).to.eql('success')
        expect(res).to.have.property('payload')
        expect(res.payload[0]).to.have.property('id')
      })
    })
  })
})
