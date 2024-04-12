import { AxiosRequestConfig } from 'axios'
import { Container } from 'typedi'

import { Endpoint } from '@/enums'
import { HttpService } from '@/services'
import { testData } from '@/test'

describe('HttpService test suite', (): void => {
  let httpService: HttpService

  beforeEach((): void => {
    httpService = Container.get(HttpService)
  })

  test('delete method should be called', async (): Promise<void> => {
    /* prettier-ignore */
    const { credentials: { username }, token } = testData,
      params = { params: { username } },
      spy = vi.spyOn(httpService, 'delete')
    await httpService.delete(Endpoint.DELETE_USER_ENDPOINT, token, <AxiosRequestConfig>params)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(Endpoint.DELETE_USER_ENDPOINT, token, <AxiosRequestConfig>params)
    expect(spy).toHaveReturnedTimes(1)
  })

  test('get method should be called', async (): Promise<void> => {
    /* prettier-ignore */
    const { queryParams: { columns, id }, token } = testData,
      params = { params: { columns, table: id } },
      spy = vi.spyOn(httpService, 'get')
    await httpService.get(Endpoint.GEOJSON_ENDPOINT, token, <AxiosRequestConfig>params)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(Endpoint.GEOJSON_ENDPOINT, token, <AxiosRequestConfig>params)
    expect(spy).toHaveReturnedTimes(1)
  })

  test('patch method should be called', async (): Promise<void> => {
    const { credentials, token } = testData,
      params = { params: { ...credentials } },
      spy = vi.spyOn(httpService, 'patch')
    await httpService.patch(Endpoint.UPDATE_PASSWORD_ENDPOINT, token, <AxiosRequestConfig>params)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(Endpoint.UPDATE_PASSWORD_ENDPOINT, token, <AxiosRequestConfig>params)
    expect(spy).toHaveReturnedTimes(1)
  })

  test('post method should be called', async (): Promise<void> => {
    const { requestBody, token } = testData,
      body = { ...requestBody },
      spy = vi.spyOn(httpService, 'post')
    await httpService.post(Endpoint.REGISTER_ENDPOINT, token, <AxiosRequestConfig>body)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(Endpoint.REGISTER_ENDPOINT, token, <AxiosRequestConfig>body)
    expect(spy).toHaveReturnedTimes(1)
  })

  test('put method should be called', async (): Promise<void> => {
    const { requestBody, token } = testData,
      body = { ...requestBody },
      spy = vi.spyOn(httpService, 'put')
    await httpService.put(Endpoint.REGISTER_ENDPOINT, token, <AxiosRequestConfig>body)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(Endpoint.REGISTER_ENDPOINT, token, <AxiosRequestConfig>body)
    expect(spy).toHaveReturnedTimes(1)
  })
})
