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
    const { jwt } = testData,
      spy = vi.spyOn(authorizationService, 'getMapboxAccessToken')
    await authorizationService.getMapboxAccessToken(jwt)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(jwt)
    expect(spy).toHaveReturnedTimes(1)
  })

  test('setJWTState method should be called', (): void => {
    const { jwt, jwtExpiry } = testData,
      spy = vi.spyOn(authorizationService, 'setJWTState')
    authorizationService.setJWTState({ jwt, jwtExpiry })
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith({ jwt, jwtExpiry })
    expect(spy).toHaveReturnedTimes(1)
  })
})
