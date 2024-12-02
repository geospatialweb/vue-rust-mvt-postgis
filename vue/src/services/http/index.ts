import { AxiosInstance, AxiosRequestConfig } from 'axios'
import { Container, Service } from 'typedi'

import { Route } from '@/enums'
import { IHttpResponseError } from '@/interfaces'
import { AxiosService, LogService, RouterService } from '@/services'
import { HttpResponse } from '@/types'

@Service()
export default class HttpService {
  #httpClient: AxiosInstance

  constructor() {
    const axiosService = Container.get(AxiosService)
    this.#httpClient = axiosService.httpClient
  }

  async delete(endpoint: string, jwtToken: string, params: AxiosRequestConfig): Promise<HttpResponse> {
    this.#httpClient.defaults.headers.delete['Authorization'] = `Bearer ${jwtToken}`
    return this.#httpClient
      .delete<HttpResponse>(endpoint, params)
      .then(({ data }) => data)
      .catch(({ message, response }: IHttpResponseError) => this.#catchError({ message, response }))
  }

  async get(endpoint: string, jwtToken: string, params: AxiosRequestConfig): Promise<HttpResponse> {
    if (jwtToken) this.#httpClient.defaults.headers.get['Authorization'] = `Bearer ${jwtToken}`
    return this.#httpClient
      .get<HttpResponse>(endpoint, params)
      .then(({ data }) => data)
      .catch(({ message, response }: IHttpResponseError) => this.#catchError({ message, response }))
  }

  async patch(endpoint: string, jwtToken: string, body: AxiosRequestConfig): Promise<HttpResponse> {
    this.#httpClient.defaults.headers.patch['Authorization'] = `Bearer ${jwtToken}`
    return this.#httpClient
      .patch<HttpResponse>(endpoint, body)
      .then(({ data }) => data)
      .catch(({ message, response }: IHttpResponseError) => this.#catchError({ message, response }))
  }

  async post(endpoint: string, jwtToken: string, body: AxiosRequestConfig): Promise<HttpResponse> {
    this.#httpClient.defaults.headers.post['Authorization'] = `Bearer ${jwtToken}`
    return this.#httpClient
      .post<HttpResponse>(endpoint, body)
      .then(({ data }) => data)
      .catch(({ message, response }: IHttpResponseError) => this.#catchError({ message, response }))
  }

  async put(endpoint: string, jwtToken: string, body: AxiosRequestConfig): Promise<HttpResponse> {
    this.#httpClient.defaults.headers.put['Authorization'] = `Bearer ${jwtToken}`
    return this.#httpClient
      .put<HttpResponse>(endpoint, body)
      .then(({ data }) => data)
      .catch(({ message, response }: IHttpResponseError) => this.#catchError({ message, response }))
  }

  #catchError({ message, response }: IHttpResponseError): void {
    const logService = Container.get(LogService)
    if (!response) return logService.logHttpRequestError(message)
    const { data, status } = response as { data: string; status: number }
    if (status === 401) {
      const routerService = Container.get(RouterService)
      void routerService.setRoute(Route.Login)
    }
    logService.logHttpRequestDataError(data)
  }
}
