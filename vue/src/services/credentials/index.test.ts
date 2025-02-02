import { Container } from 'typedi'

import { ICredentialsState } from '@/interfaces'
import { ApiService, CredentialsService } from '@/services'
import { testData } from '@/test'

const { credentials } = testData as { credentials: ICredentialsState },
  credentialsService = Container.get(CredentialsService)

describe('CredentialsService test suite 1', (): void => {
  test('credentialsState getter should be called with a return', (): void => {
    const spy = vi.spyOn(credentialsService, 'credentialsState', 'get').mockReturnValue(credentials)
    credentialsService.credentialsState
    expect(spy).toBeCalled()
    expect(spy).toHaveReturned()
  })

  test('credentialsState setter should be called', (): void => {
    const spy = vi.spyOn(credentialsService, 'credentialsState', 'set')
    credentialsService.credentialsState = credentials
    expect(spy).toBeCalled()
    expect(spy).toBeCalledWith(credentials)
  })
})

describe('CredentialsService test suite 2', (): void => {
  beforeEach(async (): Promise<void> => {
    const credentialsService = Container.get(CredentialsService)
    await credentialsService.register(credentials)
  })

  afterEach(async (): Promise<void> => {
    const { jwtToken } = window.jwtState,
      apiService = Container.get(ApiService)
    await apiService.deleteUser(credentials, jwtToken)
  })

  test('login method should be called with a return', async (): Promise<void> => {
    const spy = vi.spyOn(credentialsService, 'login')
    await credentialsService.login(credentials)
    expect(spy).toBeCalled()
    expect(spy).toBeCalledWith(credentials)
    expect(spy).toHaveReturned()
  })

  test('validateUser method should be called with a return', async (): Promise<void> => {
    const spy = vi.spyOn(credentialsService, 'validateUser')
    await credentialsService.validateUser(credentials)
    expect(spy).toBeCalled()
    expect(spy).toBeCalledWith(credentials)
  })
})

describe('CredentialsService test suite 3', (): void => {
  afterEach(async (): Promise<void> => {
    const { jwtToken } = window.jwtState,
      apiService = Container.get(ApiService)
    await apiService.deleteUser(credentials, jwtToken)
  })

  test('register method should be called with a return', async (): Promise<void> => {
    const spy = vi.spyOn(credentialsService, 'register')
    await credentialsService.register(credentials)
    expect(spy).toBeCalled()
    expect(spy).toBeCalledWith(credentials)
    expect(spy).toHaveReturned()
  })
})
