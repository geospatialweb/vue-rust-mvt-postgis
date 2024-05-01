import axios from 'axios'
import { Service } from 'typedi'

import { Url } from '@/enums'

@Service()
export default class AxiosService {
  #axios = axios
  #apiBaseUrlDev: string = Url.API_BASE_URL_DEV
  #apiBaseUrlProd: string = Url.API_BASE_URL_PROD
  #httpClient = this.#axios.create()

  constructor() {
    this.#createHttpClient()
  }

  get httpClient() {
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
    if (import.meta.env.PROD) return this.#apiBaseUrlProd
    return this.#apiBaseUrlDev
  }
}
