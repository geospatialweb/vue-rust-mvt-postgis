import { createPinia, setActivePinia } from 'pinia'
import { Container } from 'typedi'

import { ICredential } from '@/interfaces'
import { CredentialsService } from '@/services'
import { testData } from '@/test'

describe('CredentialsService test suite', (): void => {
  let credentialsService: CredentialsService

  beforeEach((): void => {
    setActivePinia(createPinia())
    credentialsService = Container.get(CredentialsService)
  })

  test('loginUser method should be called', async (): Promise<void> => {
    const { credentials } = testData,
      spy = vi.spyOn(credentialsService, 'loginUser')
    await credentialsService.loginUser(<ICredential>credentials)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(<ICredential>credentials)
    expect(spy).toHaveReturnedTimes(1)
  })

  test('registerUser method should be called', async (): Promise<void> => {
    const { requestBody } = testData,
      spy = vi.spyOn(credentialsService, 'registerUser')
    await credentialsService.registerUser(<ICredential>requestBody)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(<ICredential>requestBody)
    expect(spy).toHaveReturnedTimes(1)
  })

  test('setCredentialsState method should be called', (): void => {
    const { credentials } = testData,
      spy = vi.spyOn(credentialsService, 'setCredentialsState')
    credentialsService.setCredentialsState(<ICredential>credentials)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(<ICredential>credentials)
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
