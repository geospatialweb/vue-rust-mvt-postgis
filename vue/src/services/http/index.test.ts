import { AxiosRequestConfig } from 'axios'
import { Container } from 'typedi'

import { ApiEndpoint, CredentialsEndpoint } from '@/enums'
import { HttpService } from '@/services'
import { testData } from '@/test'

describe('HttpService test suite', (): void => {
  const httpService = Container.get(HttpService)

  test('delete method should be called', async (): Promise<void> => {
    /* prettier-ignore */
    const { credentials: { username }, jwtToken } = testData,
      deleteUserEndpoint = ApiEndpoint.DeleteUser,
      params = { params: { username } },
      spy = vi.spyOn(httpService, 'delete')
    await httpService.delete(deleteUserEndpoint, jwtToken, <AxiosRequestConfig>params)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(deleteUserEndpoint, jwtToken, <AxiosRequestConfig>params)
    expect(spy).toHaveReturnedTimes(1)
  })

  test('get method should be called', async (): Promise<void> => {
    /* prettier-ignore */
    const { queryParams: { columns, id }, jwtToken } = testData,
      geoJsonEndpoint = ApiEndpoint.Geojson,
      params = { params: { columns, table: id } },
      spy = vi.spyOn(httpService, 'get')
    await httpService.get(geoJsonEndpoint, jwtToken, <AxiosRequestConfig>params)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(geoJsonEndpoint, jwtToken, <AxiosRequestConfig>params)
    expect(spy).toHaveReturnedTimes(1)
  })

  test('patch method should be called', async (): Promise<void> => {
    const { credentials, jwtToken } = testData,
      updatePasswordEndpoint = ApiEndpoint.UpdatePassword,
      params = { params: { ...credentials } },
      spy = vi.spyOn(httpService, 'patch')
    await httpService.patch(updatePasswordEndpoint, jwtToken, <AxiosRequestConfig>params)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(updatePasswordEndpoint, jwtToken, <AxiosRequestConfig>params)
    expect(spy).toHaveReturnedTimes(1)
  })

  test('post method should be called', async (): Promise<void> => {
    const { requestBody, jwtToken } = testData,
      registerEndpoint = CredentialsEndpoint.Register,
      body = { ...requestBody },
      spy = vi.spyOn(httpService, 'post')
    await httpService.post(registerEndpoint, jwtToken, <AxiosRequestConfig>body)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(registerEndpoint, jwtToken, <AxiosRequestConfig>body)
    expect(spy).toHaveReturnedTimes(1)
  })
})
