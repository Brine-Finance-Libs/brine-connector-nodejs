import { AxiosInstance } from "axios"

export interface IClient {
  axiosInstance: AxiosInstance
  setToken: (token: string) => void
  login: (
    ethAddress: string,
    privateKey: string,
  ) => Promise<Response<LoginPayload | string>>
  getProfileInfo: () => Promise<Response<ProfileInformation | string>>
}

export interface Response<T> {
  status: 'success' | 'error'
  message: string
  payload: T
}

export interface LoginPayload {
  uid: string
  token: {
    refresh: string
    access: string
  }
}

export interface ProfileInformation {
  name: string
  customer_id: string
  img: string | null
  username: string
  stark_key: string
}
