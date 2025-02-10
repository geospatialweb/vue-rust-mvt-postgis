import { Container } from 'typedi'

import { Endpoint, EndpointPrefix } from '@/enums'
import { ApiService, CredentialsService, HttpService } from '@/services'
import { testData } from '@/test'

import type { ICredentialsState } from '@/interfaces'
import type { HttpRequest } from '@/types'

/* prettier-ignore */
const { credentials: { username, password, role } } = testData as { credentials: ICredentialsState },
  httpService = Container.get(HttpService)

describe('HttpService test suite 1', (): void => {
  beforeEach(async (): Promise<void> => {
    const { credentials } = testData as { credentials: ICredentialsState },
      credentialsService = Container.get(CredentialsService)
    await credentialsService.register(credentials)
  })

  afterEach(async (): Promise<void> => {
    const { credentials } = testData as { credentials: ICredentialsState },
      { jwtToken } = window.jwtState,
      apiService = Container.get(ApiService)
    await apiService.deleteUser(credentials, jwtToken)
  })

  test('get method should be called with a return', async (): Promise<void> => {
    const query = <HttpRequest>{ params: { username, role } },
      endpoint = `${EndpointPrefix.Api}${Endpoint.GetUser}`,
      { jwtToken } = window.jwtState,
      spy = vi.spyOn(httpService, 'get')
    await httpService.get(endpoint, query, jwtToken)
    expect(spy).toBeCalled()
    expect(spy).toBeCalledWith(endpoint, query, jwtToken)
    expect(spy).toHaveReturned()
  })

  test('patch method should be called with a return', async (): Promise<void> => {
    const body = <HttpRequest>{ username, password, role },
      endpoint = `${EndpointPrefix.Api}${Endpoint.UpdatePassword}`,
      { jwtToken } = window.jwtState,
      spy = vi.spyOn(httpService, 'patch')
    await httpService.patch(endpoint, body, jwtToken)
    expect(spy).toBeCalled()
    expect(spy).toBeCalledWith(endpoint, body, jwtToken)
    expect(spy).toHaveReturned()
  })
})

describe('HttpService test suite 2', (): void => {
  test('post method should be called with a return', async (): Promise<void> => {
    const body = <HttpRequest>{ username, password, role },
      endpoint = `${EndpointPrefix.Credentials}${Endpoint.Register}`,
      spy = vi.spyOn(httpService, 'post')
    await httpService.post(endpoint, body)
    expect(spy).toBeCalled()
    expect(spy).toBeCalledWith(endpoint, body)
    expect(spy).toHaveReturned()
  })

  test('delete method should be called with a return', async (): Promise<void> => {
    const query = <HttpRequest>{ params: { username, role } },
      endpoint = `${EndpointPrefix.Api}${Endpoint.DeleteUser}`,
      { jwtToken } = window.jwtState,
      spy = vi.spyOn(httpService, 'delete')
    await httpService.delete(endpoint, query, jwtToken)
    expect(spy).toBeCalled()
    expect(spy).toBeCalledWith(endpoint, query, jwtToken)
    expect(spy).toHaveReturned()
  })
})
