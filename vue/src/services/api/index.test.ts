import { Container } from 'typedi'

import { ICredentialsState, IGeoJsonParam } from '@/interfaces'
import { ApiService, CredentialsService } from '@/services'
import { testData } from '@/test'

const { credentials } = testData as { credentials: ICredentialsState },
  apiService = Container.get(ApiService)

describe('ApiService test suite 1', (): void => {
  test('getGeoJsonFeatureCollection method should be called with a return', async (): Promise<void> => {
    const { geoJsonParams } = testData as { geoJsonParams: IGeoJsonParam },
      { jwtToken } = window.jwtState,
      spy = vi.spyOn(apiService, 'getGeoJsonFeatureCollection')
    await apiService.getGeoJsonFeatureCollection(geoJsonParams, credentials, jwtToken)
    expect(spy).toBeCalled()
    expect(spy).toBeCalledWith(geoJsonParams, credentials, jwtToken)
    expect(spy).toHaveReturned()
  })

  test('setMapboxAccessToken method should be called with a return', async (): Promise<void> => {
    const { jwtToken } = window.jwtState,
      spy = vi.spyOn(apiService, 'getMapboxAccessToken')
    await apiService.getMapboxAccessToken(credentials, jwtToken)
    expect(spy).toBeCalled()
    expect(spy).toBeCalledWith(credentials, jwtToken)
    expect(spy).toHaveReturned()
  })
})

describe('ApiService test suite 2', (): void => {
  beforeEach(async (): Promise<void> => {
    const credentialsService = Container.get(CredentialsService)
    await credentialsService.register(credentials)
  })

  afterEach(async (): Promise<void> => {
    const { jwtToken } = window.jwtState
    await apiService.deleteUser(credentials, jwtToken)
  })

  test('getUser method should be called with a return', async (): Promise<void> => {
    const { jwtToken } = window.jwtState,
      spy = vi.spyOn(apiService, 'getUser')
    await apiService.getUser(credentials, jwtToken)
    expect(spy).toBeCalled()
    expect(spy).toBeCalledWith(credentials, jwtToken)
    expect(spy).toHaveReturned()
  })

  test('updatePassword method should be called with a return', async (): Promise<void> => {
    const { jwtToken } = window.jwtState,
      spy = vi.spyOn(apiService, 'updatePassword')
    await apiService.updatePassword(credentials, jwtToken)
    expect(spy).toBeCalled()
    expect(spy).toBeCalledWith(credentials, jwtToken)
    expect(spy).toHaveReturned()
  })
})

describe('ApiService test suite 3', (): void => {
  beforeEach(async (): Promise<void> => {
    const credentialsService = Container.get(CredentialsService)
    await credentialsService.register(credentials)
  })

  test('deleteUser method should be called with a return', async (): Promise<void> => {
    const { jwtToken } = window.jwtState,
      spy = vi.spyOn(apiService, 'deleteUser')
    await apiService.deleteUser(credentials, jwtToken)
    expect(spy).toBeCalled()
    expect(spy).toBeCalledWith(credentials, jwtToken)
    expect(spy).toHaveReturned()
  })
})
