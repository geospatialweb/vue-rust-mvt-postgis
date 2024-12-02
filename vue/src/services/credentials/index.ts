import { AxiosRequestConfig } from 'axios'
import { Container, Service } from 'typedi'

import { CredentialsEndpoint, State } from '@/enums'
import { ICredentialsState, IJwtState } from '@/interfaces'
import { HttpService, StoreService } from '@/services'

@Service()
export default class CredentialsService {
  #httpService = Container.get(HttpService)

  get credentialsState(): ICredentialsState {
    const storeService = Container.get(StoreService)
    return <ICredentialsState>storeService.getState(State.Credentials)
  }

  set #credentialsState(state: ICredentialsState) {
    const storeService = Container.get(StoreService)
    storeService.setState(State.Credentials, state)
  }

  async login(credentials: ICredentialsState): Promise<IJwtState> {
    const params = <AxiosRequestConfig>{ params: { ...credentials } }
    return <IJwtState>await this.#httpService.get(CredentialsEndpoint.Login, '', params)
  }

  async register(credentials: ICredentialsState): Promise<string> {
    const body = <AxiosRequestConfig>{ ...credentials }
    return <string>await this.#httpService.post(CredentialsEndpoint.Register, '', body)
  }

  async validateUser(username: string): Promise<string> {
    const params = <AxiosRequestConfig>{ params: { username } }
    return <string>await this.#httpService.get(CredentialsEndpoint.ValidateUser, '', params)
  }

  setCredentialsState(state: ICredentialsState): void {
    this.#credentialsState = { ...this.credentialsState, ...state }
  }
}
