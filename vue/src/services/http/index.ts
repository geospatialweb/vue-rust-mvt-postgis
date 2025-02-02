import { Container, Service } from 'typedi'

import { EndpointPrefix, Header, HTTP, Route } from '@/enums'
import { AxiosService, LogService, RouterService } from '@/services'

import type { AxiosInstance } from 'axios'
import type { IHttpResponseError } from '@/interfaces'
import type { HttpRequest, HttpResponse } from '@/types'

@Service()
export default class HttpService {
  #httpClient: AxiosInstance

  constructor() {
    const { httpClient } = Container.get(AxiosService)
    this.#httpClient = httpClient
  }

  async delete(endpoint: string, query: HttpRequest, jwtToken: string): Promise<HttpResponse> {
    this.#httpClient.defaults.headers.delete[Header.Authorization] = `${Header.Bearer} ${jwtToken}`
    return this.#httpClient
      .delete<HttpResponse>(endpoint, query)
      .then(({ data }): HttpResponse => data)
      .catch(({ message, response }: IHttpResponseError) => this.#catchError({ message, response }))
  }

  async get(endpoint: string, query: HttpRequest, jwtToken?: string): Promise<HttpResponse> {
    if (endpoint.includes(EndpointPrefix.Api))
      this.#httpClient.defaults.headers.get[Header.Authorization] = `${Header.Bearer} ${jwtToken}`
    return this.#httpClient
      .get<HttpResponse>(endpoint, query)
      .then(({ data }): HttpResponse => data)
      .catch(({ message, response }: IHttpResponseError) => this.#catchError({ message, response }))
  }

  async patch(endpoint: string, body: HttpRequest, jwtToken: string): Promise<HttpResponse> {
    this.#httpClient.defaults.headers.patch[Header.Authorization] = `${Header.Bearer} ${jwtToken}`
    return this.#httpClient
      .patch<HttpResponse>(endpoint, body)
      .then(({ data }): HttpResponse => data)
      .catch(({ message, response }: IHttpResponseError) => this.#catchError({ message, response }))
  }

  async post(endpoint: string, body: HttpRequest, jwtToken?: string): Promise<HttpResponse> {
    if (endpoint.includes(EndpointPrefix.Api))
      this.#httpClient.defaults.headers.post[Header.Authorization] = `${Header.Bearer} ${jwtToken}`
    return this.#httpClient
      .post<HttpResponse>(endpoint, body)
      .then(({ data }): HttpResponse => data)
      .catch(({ message, response }: IHttpResponseError) => this.#catchError({ message, response }))
  }

  async #catchError({ message, response }: IHttpResponseError): Promise<HttpResponse> {
    const { logErrorMessage } = Container.get(LogService)
    if (!response) return <undefined>logErrorMessage(message)
    const { data, status } = response as { data: string; status: number }
    if (status === Number(HTTP.Forbidden) || status === Number(HTTP.Unauthorized)) {
      const route = Route.Login,
        { setRoute } = Container.get(RouterService)
      await setRoute(route)
    }
    logErrorMessage(data)
  }
}
