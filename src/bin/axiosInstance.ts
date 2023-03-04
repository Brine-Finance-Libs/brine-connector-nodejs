import axios, { AxiosInstance as AxiosInstanceType } from 'axios'
import { LoginPayload, Response } from '../types'

const protectedRouteResponse: Response<string> = {
  message:
    'This is a private endpoint... Please use login() or completeLogin() first',
  status: 'error',
  payload: '',
}

export class AxiosInstance {
  axiosInstance: AxiosInstanceType
  token?: string
  reLogin: () => Promise<Response<LoginPayload> | undefined>

  constructor(reLogin: () => Promise<Response<LoginPayload> | undefined>) {
    this.reLogin = reLogin

    this.axiosInstance = axios.create({
      baseURL: 'https://api-testnet.brine.fi',
    })

    this.axiosInstance.interceptors.response.use(
      (response) => {
        return response
      },
      async (error) => {
        const originalRequest = error.config
        console.log(originalRequest._retry)
        if (error.response.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true
          const res = await this.reLogin()
          
          if (res) {
            axios.defaults.headers.common[
              'Authorization'
              // @ts-expect-error: Response format is wrong
            ] = `JWT ${res.token.access}`
            // @ts-expect-error
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
    const auth = this.token ? true : false
    if (!auth) throw protectedRouteResponse
  }
}
