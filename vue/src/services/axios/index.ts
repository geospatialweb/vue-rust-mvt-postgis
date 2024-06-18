import axios from 'axios'
import { Service } from 'typedi'

@Service()
export default class AxiosService {
  #axios = axios
  #httpClient = this.#axios.create()

  #apiBaseUrlDev = `${import.meta.env.VITE_API_BASE_URL_DEV}`
  #apiBaseUrlProd = `${import.meta.env.VITE_API_BASE_URL_PROD}`

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
