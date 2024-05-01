import { AxiosInstance, AxiosRequestConfig } from 'axios'
import { Container, Service } from 'typedi'

import { Route } from '@/enums'
import { IHttpResponseError } from '@/interfaces'
import { AxiosService, RouterService } from '@/services'
import { HttpResponse } from '@/types'

@Service()
export default class HttpService {
  #axiosService = Container.get(AxiosService)
  #routerService = Container.get(RouterService)

  #httpClient: AxiosInstance
  #loginRoute = Route.LOGIN

  constructor() {
    const { httpClient } = this.#axiosService
    this.#httpClient = httpClient
  }

  async delete(endpoint: string, token: string, params: AxiosRequestConfig): Promise<HttpResponse> {
    if (token) this.#httpClient.defaults.headers.delete['Authorization'] = `Bearer ${token}`
    return this.#httpClient
      .delete<HttpResponse>(endpoint, params)
      .then(({ data }) => data)
      .catch(async ({ message, response }: IHttpResponseError) => await this.#catchError({ message, response }))
  }

  async get(endpoint: string, token: string, params: AxiosRequestConfig): Promise<HttpResponse> {
    if (token) this.#httpClient.defaults.headers.get['Authorization'] = `Bearer ${token}`
    return this.#httpClient
      .get<HttpResponse>(endpoint, params)
      .then(({ data }) => data)
      .catch(async ({ message, response }: IHttpResponseError) => await this.#catchError({ message, response }))
  }

  async patch(endpoint: string, token: string, body: AxiosRequestConfig): Promise<HttpResponse> {
    if (token) this.#httpClient.defaults.headers.patch['Authorization'] = `Bearer ${token}`
    return this.#httpClient
      .patch<HttpResponse>(endpoint, body)
      .then(({ data }) => data)
      .catch(async ({ message, response }: IHttpResponseError) => await this.#catchError({ message, response }))
  }

  async post(endpoint: string, token: string, body: AxiosRequestConfig): Promise<HttpResponse> {
    if (token) this.#httpClient.defaults.headers.post['Authorization'] = `Bearer ${token}`
    return this.#httpClient
      .post<HttpResponse>(endpoint, body)
      .then(({ data }) => data)
      .catch(async ({ message, response }: IHttpResponseError) => await this.#catchError({ message, response }))
  }

  async put(endpoint: string, token: string, body: AxiosRequestConfig): Promise<HttpResponse> {
    if (token) this.#httpClient.defaults.headers.put['Authorization'] = `Bearer ${token}`
    return this.#httpClient
      .put<HttpResponse>(endpoint, body)
      .then(({ data }) => data)
      .catch(async ({ message, response }: IHttpResponseError) => await this.#catchError({ message, response }))
  }

  async #catchError({ message, response }: IHttpResponseError): Promise<void> {
    if (!response) return this.#consoleError(message)
    const { data, status } = response
    if (status === 401) await this.#setRoute(this.#loginRoute)
    this.#consoleError(<string>data)
  }

  async #setRoute(name: string): Promise<void> {
    await this.#routerService.setRoute(name)
  }

  #consoleError(msg: string): void {
    import.meta.env.DEV && console.error(msg)
  }
}
