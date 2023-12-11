import axios, { AxiosInstance } from 'axios'
import { Service } from 'typedi'

import { Url } from '@/enums'
import { IUrl } from '@/interfaces'

@Service()
export default class AxiosService {
  #axios = axios
  #httpClient = this.#axios.create()
  #urls: IUrl = Url

  constructor() {
    this.#createHttpClient()
  }

  get httpClient(): AxiosInstance {
    return this.#httpClient
  }

  #createHttpClient(): void {
    this.#httpClient = this.#axios.create({
      baseURL: this.#setBaseURL(),
      headers: { Accept: 'application/json' },
      timeout: 2000
    })
  }

  #setBaseURL(): string {
    if (import.meta.env.PROD) return this.#urls.API_BASE_URL_PROD
    return this.#urls.API_BASE_URL_DEV
  }
}
