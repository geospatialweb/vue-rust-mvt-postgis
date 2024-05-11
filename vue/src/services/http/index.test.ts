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
      deleteUserEndpoint = Endpoint.DELETE_USER_ENDPOINT,
      params = { params: { username } },
      spy = vi.spyOn(httpService, 'delete')
    await httpService.delete(deleteUserEndpoint, token, <AxiosRequestConfig>params)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(deleteUserEndpoint, token, <AxiosRequestConfig>params)
    expect(spy).toHaveReturnedTimes(1)
  })

  test('get method should be called', async (): Promise<void> => {
    /* prettier-ignore */
    const { queryParams: { columns, id }, token } = testData,
      geoJsonEndpoint = Endpoint.GEOJSON_ENDPOINT,
      params = { params: { columns, table: id } },
      spy = vi.spyOn(httpService, 'get')
    await httpService.get(geoJsonEndpoint, token, <AxiosRequestConfig>params)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(geoJsonEndpoint, token, <AxiosRequestConfig>params)
    expect(spy).toHaveReturnedTimes(1)
  })

  test('patch method should be called', async (): Promise<void> => {
    const { credentials, token } = testData,
      updatePasswordEndpoint = Endpoint.UPDATE_PASSWORD_ENDPOINT,
      params = { params: { ...credentials } },
      spy = vi.spyOn(httpService, 'patch')
    await httpService.patch(updatePasswordEndpoint, token, <AxiosRequestConfig>params)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(updatePasswordEndpoint, token, <AxiosRequestConfig>params)
    expect(spy).toHaveReturnedTimes(1)
  })

  test('post method should be called', async (): Promise<void> => {
    const { requestBody, token } = testData,
      registerEndpoint = Endpoint.REGISTER_ENDPOINT,
      body = { ...requestBody },
      spy = vi.spyOn(httpService, 'post')
    await httpService.post(registerEndpoint, token, <AxiosRequestConfig>body)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(registerEndpoint, token, <AxiosRequestConfig>body)
    expect(spy).toHaveReturnedTimes(1)
  })

  test('put method should be called', async (): Promise<void> => {
    const { requestBody, token } = testData,
      registerEndpoint = Endpoint.REGISTER_ENDPOINT,
      body = { ...requestBody },
      spy = vi.spyOn(httpService, 'put')
    await httpService.put(registerEndpoint, token, <AxiosRequestConfig>body)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(registerEndpoint, token, <AxiosRequestConfig>body)
    expect(spy).toHaveReturnedTimes(1)
  })
})
