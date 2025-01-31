import axios from 'axios'
import { Service } from 'typedi'

import { Axios, URL } from '@/enums'

import type { AxiosInstance, AxiosStatic } from 'axios'

@Service()
export default class AxiosService {
  #axios: AxiosStatic
  #httpClient: AxiosInstance

  constructor() {
    this.#axios = axios
    this.#httpClient = this.#createHttpClient()
  }

  get httpClient(): AxiosInstance {
    return this.#httpClient
  }

  #createHttpClient(): AxiosInstance {
    return this.#axios.create({
      baseURL: this.#setBaseURL(),
      headers: { Accept: Axios.AcceptHeader },
      timeout: Number(Axios.Timeout)
    })
  }

  #setBaseURL(): string {
    if (import.meta.env.DEV) return URL.ApiBaseUrlDev
    return URL.ApiBaseUrlProd
  }
}
