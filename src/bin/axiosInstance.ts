import axios, { AxiosInstance as AxiosInstanceType } from 'axios'
import { Response } from '../types'

const protectedRouteResponse: Response<string> = {
  message: 'This is a private endpoint... Please use login() or completeLogin() first',
  status: 'error',
  payload: ''
}

export class AxiosInstance {
  axiosInstance: AxiosInstanceType
  token?: string

  constructor() {
    this.axiosInstance = axios.create({
      baseURL: 'https://api-testnet.brine.fi',
    })
  }

  setToken(token: string) {
    this.axiosInstance.interceptors.request.use(function (config) {
      config.headers.Authorization = token ? `JWT ${token}` : ''
      return config
    })
    this.token = token
  }

  getAuthStatus() {
    const auth =  this.token ? true : false
    if(!auth) throw protectedRouteResponse
  }
}
