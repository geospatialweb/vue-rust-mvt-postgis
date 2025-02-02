import { Container } from 'typedi'

import { AuthorizationService } from '@/services'

describe('AuthorizationService test suite', (): void => {
  const authorizationService = Container.get(AuthorizationService)

  test('jwtState getter should be called with a return', (): void => {
    const jwtState = window.jwtState,
      spy = vi.spyOn(authorizationService, 'jwtState', 'get').mockReturnValue(jwtState)
    authorizationService.jwtState
    expect(spy).toBeCalled()
    expect(spy).toHaveReturned()
  })

  test('jwtState setter should be called', (): void => {
    const jwtState = window.jwtState,
      spy = vi.spyOn(authorizationService, 'jwtState', 'set')
    authorizationService.jwtState = jwtState
    expect(spy).toBeCalled()
    expect(spy).toBeCalledWith(jwtState)
  })

  test('setMapboxAccessToken method should be called', async (): Promise<void> => {
    const spy = vi.spyOn(authorizationService, 'setMapboxAccessToken')
    await authorizationService.setMapboxAccessToken()
    expect(spy).toBeCalled()
  })
})
