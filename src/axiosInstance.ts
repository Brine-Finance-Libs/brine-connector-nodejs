import axios, { AxiosInstance as AxiosInstanceType } from 'axios'
import * as dotenv from 'dotenv'
import { AuthenticationError } from './error'
import { LoginResponse } from './types'
dotenv.config()

export class AxiosInstance {
  axiosInstance: AxiosInstanceType
  token?: string
  reLogin: () => Promise<LoginResponse | undefined>

  constructor(
    reLogin: () => Promise<LoginResponse | undefined>,
    baseUrl?: string,
  ) {
    this.reLogin = reLogin

    this.axiosInstance = axios.create({
      baseURL: baseUrl ?? 'https://api.trade.fi',
    })

    this.axiosInstance.interceptors.response.use(
      (response) => {
        return response
      },
      async (error) => {
        const originalRequest = error.config
        if (
          error?.response?.status === 401 &&
          !originalRequest._retry &&
          this.token
        ) {
          originalRequest._retry = true
          const res = await this.reLogin()

          if (res) {
            axios.defaults.headers.common[
              'Authorization'
            ] = `JWT ${res.token.access}`
            this.setToken(res.token.access)
          }
          return this.axiosInstance(originalRequest)
        }
        return Promise.reject(error)
      },
    )
  }

  setToken(token: string) {
    this.axiosInstance.interceptors.request.use((config) => {
      config.headers.Authorization = `JWT ${token}`
      return config
    })
    this.token = token
  }

  getAuthStatus() {
    if (!this.token)
      throw new AuthenticationError(
        'This is a private endpoint... Please use login() or completeLogin() first',
      )
  }
}
