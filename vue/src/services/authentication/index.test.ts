import { Container } from 'typedi'

import { ICredentialsState } from '@/interfaces'
import { ApiService, AuthenticationService, CredentialsService } from '@/services'
import { testData } from '@/test'

const { credentials } = testData as { credentials: ICredentialsState }

describe('AuthenticationService test suite', (): void => {
  beforeEach(async (): Promise<void> => {
    const credentialsService = Container.get(CredentialsService)
    await credentialsService.register(credentials)
  })

  afterEach(async (): Promise<void> => {
    const { jwtToken } = window.jwtState,
      apiService = Container.get(ApiService)
    await apiService.deleteUser(credentials, jwtToken)
  })

  test('login method should be called', async (): Promise<void> => {
    const authenticationService = Container.get(AuthenticationService),
      spy = vi.spyOn(authenticationService, 'login')
    await authenticationService.login(credentials)
    expect(spy).toBeCalled()
    expect(spy).toBeCalledWith(credentials)
  })
})
