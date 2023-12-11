import { Container } from 'typedi'

import { ICredential, IQueryParam } from '@/interfaces'
import { ApiService } from '@/services'
import { testData } from '@/test'

describe('ApiService test suite', (): void => {
  let apiService: ApiService

  beforeEach((): void => {
    apiService = Container.get(ApiService)
  })

  test('deleteUser method should be called', async (): Promise<void> => {
    /* prettier-ignore */
    const { jwt, credentials: { username } } = testData,
      spy = vi.spyOn(apiService, 'deleteUser')
    await apiService.deleteUser(jwt, username)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(jwt, username)
    expect(spy).toHaveReturnedTimes(1)
  })

  test('getGeoJSONFeatureCollection method should be called', async (): Promise<void> => {
    const { jwt, queryParams } = testData,
      spy = vi.spyOn(apiService, 'getGeoJSONFeatureCollection')
    await apiService.getGeoJSONFeatureCollection(jwt, <IQueryParam>queryParams)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(jwt, <IQueryParam>queryParams)
    expect(spy).toHaveReturnedTimes(1)
  })

  test('getMapboxAccessToken method should be called', async (): Promise<void> => {
    const { jwt } = testData,
      spy = vi.spyOn(apiService, 'getMapboxAccessToken')
    await apiService.getMapboxAccessToken(jwt)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(jwt)
    expect(spy).toHaveReturnedTimes(1)
  })

  test('getUser method should be called', async (): Promise<void> => {
    /* prettier-ignore */
    const { jwt, credentials: { username } } = testData,
      spy = vi.spyOn(apiService, 'getUser')
    await apiService.getUser(jwt, username)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(jwt, username)
    expect(spy).toHaveReturnedTimes(1)
  })

  test('updatePassword method should be called', async (): Promise<void> => {
    const { jwt, credentials } = testData,
      spy = vi.spyOn(apiService, 'updatePassword')
    await apiService.updatePassword(jwt, <ICredential>credentials)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(jwt, <ICredential>credentials)
    expect(spy).toHaveReturnedTimes(1)
  })
})
