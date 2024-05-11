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
    const { token } = testData,
      spy = vi.spyOn(authorizationService, 'getMapboxAccessToken')
    await authorizationService.getMapboxAccessToken(token)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(token)
    expect(spy).toHaveReturnedTimes(1)
  })

  test('setJWTState method should be called', (): void => {
    const { token, expiry } = testData,
      spy = vi.spyOn(authorizationService, 'setJWTState')
    authorizationService.setJWTState({ token, expiry })
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith({ token, expiry })
    expect(spy).toHaveReturnedTimes(1)
  })
})
