import { createPinia, setActivePinia } from 'pinia'
import { Container } from 'typedi'

import { ICredentialState } from '@/interfaces'
import { AuthenticationService } from '@/services'
import { testData } from '@/test'

describe('AuthenticationService test suite', (): void => {
  setActivePinia(createPinia())

  test('login method should be called', async (): Promise<void> => {
    const { credentials } = testData,
      authenticationService = Container.get(AuthenticationService),
      spy = vi.spyOn(authenticationService, 'login')
    await authenticationService.login(<ICredentialState>credentials)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(<ICredentialState>credentials)
    expect(spy).toHaveReturnedTimes(1)
  })
})
