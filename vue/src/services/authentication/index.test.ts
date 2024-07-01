import { Container } from 'typedi'

import { ICredentialsState } from '@/interfaces'
import { AuthenticationService } from '@/services'
import { testData } from '@/test'

describe('AuthenticationService test suite', (): void => {
  test('login method should be called', async (): Promise<void> => {
    const { credentials } = testData,
      authenticationService = Container.get(AuthenticationService),
      spy = vi.spyOn(authenticationService, 'login')
    await authenticationService.login(<ICredentialsState>credentials)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(<ICredentialsState>credentials)
    expect(spy).toHaveReturnedTimes(1)
  })
})
