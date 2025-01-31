import { Container } from 'typedi'

import { ApiService, RegistrationService } from '@/services'
import { ICredentialsState } from '@/interfaces'
import { testData } from '@/test'

const { credentials } = testData as { credentials: ICredentialsState }

afterEach(async (): Promise<void> => {
  const { jwtToken } = window.jwtState,
    apiService = Container.get(ApiService)
  await apiService.deleteUser(credentials, jwtToken)
})

describe('RegistrationService test suite', (): void => {
  test('register method should be called', async (): Promise<void> => {
    const registrationService = Container.get(RegistrationService),
      spy = vi.spyOn(registrationService, 'register')
    await registrationService.register(credentials)
    expect(spy).toBeCalled()
    expect(spy).toBeCalledWith(credentials)
  })
})
