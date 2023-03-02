import axios, { AxiosInstance as AxiosInstanceType } from 'axios'

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
    return this.token ? true : false
  }
}
