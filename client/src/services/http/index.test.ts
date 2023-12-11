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
    const { DELETE_USER_ENDPOINT } = Endpoint,
      /* prettier-ignore */
      { credentials: { username }, jwt } = testData,
      params = { params: { username } },
      spy = vi.spyOn(httpService, 'delete')
    await httpService.delete(DELETE_USER_ENDPOINT, jwt, <AxiosRequestConfig>params)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(DELETE_USER_ENDPOINT, jwt, <AxiosRequestConfig>params)
    expect(spy).toHaveReturnedTimes(1)
  })

  test('get method should be called', async (): Promise<void> => {
    const { GEOJSON_ENDPOINT } = Endpoint,
      /* prettier-ignore */
      { jwt, queryParams: { columns, id } } = testData,
      params = { params: { columns, table: id } },
      spy = vi.spyOn(httpService, 'get')
    await httpService.get(GEOJSON_ENDPOINT, jwt, <AxiosRequestConfig>params)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(GEOJSON_ENDPOINT, jwt, <AxiosRequestConfig>params)
    expect(spy).toHaveReturnedTimes(1)
  })

  test('patch method should be called', async (): Promise<void> => {
    const { UPDATE_PASSWORD_ENDPOINT } = Endpoint,
      { credentials, jwt } = testData,
      params = { params: { ...credentials } },
      spy = vi.spyOn(httpService, 'patch')
    await httpService.patch(UPDATE_PASSWORD_ENDPOINT, jwt, <AxiosRequestConfig>params)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(UPDATE_PASSWORD_ENDPOINT, jwt, <AxiosRequestConfig>params)
    expect(spy).toHaveReturnedTimes(1)
  })

  test('post method should be called', async (): Promise<void> => {
    const { REGISTER_ENDPOINT } = Endpoint,
      { jwt, requestBody } = testData,
      body = { ...requestBody },
      spy = vi.spyOn(httpService, 'post')
    await httpService.post(REGISTER_ENDPOINT, jwt, <AxiosRequestConfig>body)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(REGISTER_ENDPOINT, jwt, <AxiosRequestConfig>body)
    expect(spy).toHaveReturnedTimes(1)
  })

  test('put method should be called', async (): Promise<void> => {
    const { REGISTER_ENDPOINT } = Endpoint,
      { jwt, requestBody } = testData,
      body = { ...requestBody },
      spy = vi.spyOn(httpService, 'put')
    await httpService.put(REGISTER_ENDPOINT, jwt, <AxiosRequestConfig>body)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(REGISTER_ENDPOINT, jwt, <AxiosRequestConfig>body)
    expect(spy).toHaveReturnedTimes(1)
  })
})
