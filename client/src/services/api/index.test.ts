import { Container } from 'typedi'

import { ICredentialState, IQueryParam } from '@/interfaces'
import { ApiService } from '@/services'
import { testData } from '@/test'

describe('ApiService test suite', (): void => {
  let apiService: ApiService

  beforeEach((): void => {
    apiService = Container.get(ApiService)
  })

  test('deleteUser method should be called', async (): Promise<void> => {
    /* prettier-ignore */
    const { token, credentials: { username } } = testData,
      spy = vi.spyOn(apiService, 'deleteUser')
    await apiService.deleteUser(token, username)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(token, username)
    expect(spy).toHaveReturnedTimes(1)
  })

  test('getGeoJSONFeatureCollection method should be called', async (): Promise<void> => {
    const { token, queryParams } = testData,
      spy = vi.spyOn(apiService, 'getGeoJSONFeatureCollection')
    await apiService.getGeoJSONFeatureCollection(token, <IQueryParam>queryParams)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(token, <IQueryParam>queryParams)
    expect(spy).toHaveReturnedTimes(1)
  })

  test('getMapboxAccessToken method should be called', async (): Promise<void> => {
    const { token } = testData,
      spy = vi.spyOn(apiService, 'getMapboxAccessToken')
    await apiService.getMapboxAccessToken(token)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(token)
    expect(spy).toHaveReturnedTimes(1)
  })

  test('getUser method should be called', async (): Promise<void> => {
    /* prettier-ignore */
    const { token, credentials: { username } } = testData,
      spy = vi.spyOn(apiService, 'getUser')
    await apiService.getUser(token, username)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(token, username)
    expect(spy).toHaveReturnedTimes(1)
  })

  test('updatePassword method should be called', async (): Promise<void> => {
    const { token, credentials } = testData,
      spy = vi.spyOn(apiService, 'updatePassword')
    await apiService.updatePassword(token, <ICredentialState>credentials)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(token, <ICredentialState>credentials)
    expect(spy).toHaveReturnedTimes(1)
  })
})
