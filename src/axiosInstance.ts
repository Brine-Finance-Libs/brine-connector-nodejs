import axios, { AxiosInstance as AxiosInstanceType } from 'axios'
import { AuthenticationError } from './error'
import { LoginResponse, Response } from './types'

export class AxiosInstance {
  axiosInstance: AxiosInstanceType
  accessToken?: string | null
  refreshToken?: string | null
  getRefreshToken: () => Promise<Response<LoginResponse['token']> | undefined>

  constructor(
    getRefreshToken: () => Promise<
      Response<LoginResponse['token']> | undefined
    >,
    baseUrl?: string,
  ) {
    this.getRefreshToken = getRefreshToken

    this.axiosInstance = axios.create({
      baseURL: baseUrl ?? 'https://api.brine.fi',
    })

    this.interceptors()
  }

  interceptors = () => {
    this.axiosInstance.interceptors.request.use((config) => {
      if (this.accessToken)
        config.headers.Authorization = `JWT ${this.accessToken}`
      return config
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
          this.accessToken &&
          error.response.data.payload.token_type === 'access'
        ) {
          originalRequest._retry = true

          const res = await this.getRefreshToken()
          if (res) {
            this.accessToken = res?.payload?.access
            this.refreshToken = res?.payload?.refresh
            originalRequest.headers.Authorization = `JWT ${res.payload.access}`
          }
          return this.axiosInstance(originalRequest)
        }
        return Promise.reject(error)
      },
    )
  }

  setRefreshToken = (token: string | null) => {
    this.refreshToken = token
  }

  setAccessToken = (token: string | null) => {
    this.accessToken = token
  }

  getAuthStatus = () => {
    if (!this.accessToken)
      throw new AuthenticationError(
        'This is a private endpoint... Please use login() or completeLogin() first',
      )
  }
}
