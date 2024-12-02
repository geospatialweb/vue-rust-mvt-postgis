import { Container } from 'typedi'

import { ICredentialsState } from '@/interfaces'
import { RegistrationService } from '@/services'
import { testData } from '@/test'

describe('RegistrationService test suite', (): void => {
  test('register method should be called', async (): Promise<void> => {
    const { credentials } = testData as { credentials: ICredentialsState },
      registrationService = Container.get(RegistrationService),
      spy = vi.spyOn(registrationService, 'register')
    await registrationService.register(credentials)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(credentials)
    expect(spy).toHaveReturnedTimes(1)
  })
})
