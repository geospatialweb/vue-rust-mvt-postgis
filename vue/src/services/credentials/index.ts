import { Container, Service } from 'typedi'

import { Endpoint, EndpointPrefix, State } from '@/enums'
import { HttpService, StoreService } from '@/services'

import type { ICredentialsState, IJwtState, IUser } from '@/interfaces'
import type { HttpRequest } from '@/types'

@Service()
export default class CredentialsService {
  #endpointPrefix: EndpointPrefix
  #httpService: HttpService

  constructor() {
    this.#endpointPrefix = EndpointPrefix.Credentials
    this.#httpService = Container.get(HttpService)
  }

  get credentialsState(): ICredentialsState {
    const { getState } = Container.get(StoreService)
    return <ICredentialsState>getState(State.Credentials)
  }

  set credentialsState(state: ICredentialsState) {
    const { setState } = Container.get(StoreService)
    setState(State.Credentials, state)
  }

  login = async ({ username, password, role }: ICredentialsState): Promise<IJwtState> => {
    const query = <HttpRequest>{ params: { username, password, role } },
      endpoint = `${this.#endpointPrefix}${Endpoint.Login}`
    return <IJwtState>await this.#httpService.get(endpoint, query)
  }

  register = async ({ username, password, role }: ICredentialsState): Promise<IUser> => {
    const body = <HttpRequest>{ username, password, role },
      endpoint = `${this.#endpointPrefix}${Endpoint.Register}`
    return <IUser>await this.#httpService.post(endpoint, body)
  }

  validateUser = async ({ username, role }: ICredentialsState): Promise<IUser> => {
    const query = <HttpRequest>{ params: { username, role } },
      endpoint = `${this.#endpointPrefix}${Endpoint.ValidateUser}`
    return <IUser>await this.#httpService.get(endpoint, query)
  }
}
