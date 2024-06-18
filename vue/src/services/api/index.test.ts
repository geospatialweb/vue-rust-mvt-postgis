import { Container } from 'typedi'

import { ICredentialsState, IQueryParam } from '@/interfaces'
import { ApiService } from '@/services'
import { testData } from '@/test'

describe('ApiService test suite', (): void => {
  let apiService: ApiService

  beforeEach((): void => {
    apiService = Container.get(ApiService)
  })

  test('deleteUser method should be called', async (): Promise<void> => {
    /* prettier-ignore */
    const { jwtToken, credentials: { username } } = testData,
      spy = vi.spyOn(apiService, 'deleteUser')
    await apiService.deleteUser(jwtToken, username)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(jwtToken, username)
    expect(spy).toHaveReturnedTimes(1)
  })

  test('getGeoJSONFeatureCollection method should be called', async (): Promise<void> => {
    const { jwtToken, queryParams } = testData,
      spy = vi.spyOn(apiService, 'getGeoJSONFeatureCollection')
    await apiService.getGeoJSONFeatureCollection(jwtToken, <IQueryParam>queryParams)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(jwtToken, <IQueryParam>queryParams)
    expect(spy).toHaveReturnedTimes(1)
  })

  test('getMapboxAccessToken method should be called', async (): Promise<void> => {
    const { jwtToken } = testData,
      spy = vi.spyOn(apiService, 'getMapboxAccessToken')
    await apiService.getMapboxAccessToken(jwtToken)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(jwtToken)
    expect(spy).toHaveReturnedTimes(1)
  })

  test('getUser method should be called', async (): Promise<void> => {
    /* prettier-ignore */
    const { jwtToken, credentials: { username } } = testData,
      spy = vi.spyOn(apiService, 'getUser')
    await apiService.getUser(jwtToken, username)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(jwtToken, username)
    expect(spy).toHaveReturnedTimes(1)
  })

  test('updatePassword method should be called', async (): Promise<void> => {
    const { jwtToken, credentials } = testData,
      spy = vi.spyOn(apiService, 'updatePassword')
    await apiService.updatePassword(jwtToken, <ICredentialsState>credentials)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(jwtToken, <ICredentialsState>credentials)
    expect(spy).toHaveReturnedTimes(1)
  })
})
