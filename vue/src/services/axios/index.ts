import axios, { AxiosInstance, AxiosStatic } from 'axios'
import { Service } from 'typedi'

import { URL } from '@/enums'

@Service()
export default class AxiosService {
  #axios: AxiosStatic = axios
  #httpClient: AxiosInstance

  constructor() {
    this.#httpClient = this.#createHttpClient()
  }

  get httpClient(): AxiosInstance {
    return this.#httpClient
  }

  #createHttpClient(): AxiosInstance {
    return this.#axios.create({
      baseURL: this.#setBaseURL(),
      headers: { Accept: 'application/json' },
      timeout: 2000
    })
  }

  #setBaseURL(): string {
    if (import.meta.env.DEV) return URL.ApiBaseUrlDev
    return URL.ApiBaseUrlProd
  }
}
