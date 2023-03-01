import { AxiosError, AxiosInstance as AxiosInstanceType } from 'axios'
import { IClient, LoginPayload, ProfileInformation, Response } from '../types'
import { AxiosInstance } from './axiosInstance'
import { signMsg } from './blockchain_utils'

export class Client implements IClient {
  axiosInstance: AxiosInstanceType
  setToken: (token: string) => void

  constructor() {
    const axios = new AxiosInstance()
    this.axiosInstance = axios.axiosInstance
    this.setToken = axios.setToken
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
