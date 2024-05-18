import { createPinia, setActivePinia } from 'pinia'
import { Container } from 'typedi'

import { AuthorizationService } from '@/services'
import { testData } from '@/test'

describe('AuthorizationService test suite', (): void => {
  let authorizationService: AuthorizationService

  beforeEach((): void => {
    setActivePinia(createPinia())
    authorizationService = Container.get(AuthorizationService)
  })

  test('getMapboxAccessToken method should be called', async (): Promise<void> => {
    const { jwtToken } = testData,
      spy = vi.spyOn(authorizationService, 'getMapboxAccessToken')
    await authorizationService.getMapboxAccessToken(jwtToken)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(jwtToken)
    expect(spy).toHaveReturnedTimes(1)
  })

  test('setJWTState method should be called', (): void => {
    const { jwtToken, jwtExpiry } = testData,
      spy = vi.spyOn(authorizationService, 'setJWTState')
    authorizationService.setJWTState({ jwtToken, jwtExpiry })
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith({ jwtToken, jwtExpiry })
    expect(spy).toHaveReturnedTimes(1)
  })
})
