import { createPinia, setActivePinia } from 'pinia'
import { Container } from 'typedi'

import { ICredentialsState } from '@/interfaces'
import { CredentialsService } from '@/services'
import { testData } from '@/test'

describe('CredentialService test suite', (): void => {
  let credentialsService: CredentialsService

  beforeEach((): void => {
    setActivePinia(createPinia())
    credentialsService = Container.get(CredentialsService)
  })

  test('login method should be called', async (): Promise<void> => {
    const { credentials } = testData,
      spy = vi.spyOn(credentialsService, 'login')
    await credentialsService.login(<ICredentialsState>credentials)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(<ICredentialsState>credentials)
    expect(spy).toHaveReturnedTimes(1)
  })

  test('register method should be called', async (): Promise<void> => {
    const { requestBody } = testData,
      spy = vi.spyOn(credentialsService, 'register')
    await credentialsService.register(<ICredentialsState>requestBody)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(<ICredentialsState>requestBody)
    expect(spy).toHaveReturnedTimes(1)
  })

  test('setCredentialsState method should be called', (): void => {
    const { credentials } = testData,
      spy = vi.spyOn(credentialsService, 'setCredentialsState')
    credentialsService.setCredentialsState(<ICredentialsState>credentials)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(<ICredentialsState>credentials)
    expect(spy).toHaveReturnedTimes(1)
  })

  test('validateUser method should be called', async (): Promise<void> => {
    /* prettier-ignore */
    const { credentials: { username } } = testData,
      spy = vi.spyOn(credentialsService, 'validateUser')
    await credentialsService.validateUser(username)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(username)
    expect(spy).toHaveReturnedTimes(1)
  })
})
