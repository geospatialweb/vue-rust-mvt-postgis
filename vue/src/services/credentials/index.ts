import { AxiosRequestConfig } from 'axios'
import { Container, Service } from 'typedi'

import { Endpoint, State } from '@/enums'
import { ICredentialState, IJWTState } from '@/interfaces'
import { HttpService, StoreService } from '@/services'

@Service()
export default class CredentialsService {
  #httpService = Container.get(HttpService)
  #storeService = Container.get(StoreService)

  #credentials: string = State.CREDENTIALS
  #loginEndpoint: string = Endpoint.LOGIN_ENDPOINT
  #registerEndpoint: string = Endpoint.REGISTER_ENDPOINT
  #validateEndpoint: string = Endpoint.VALIDATE_USER_ENDPOINT

  get credentialsState() {
    return <ICredentialState>this.#storeService.getState(this.#credentials)
  }

  set #credentialsState(state: ICredentialState) {
    this.#storeService.setState(this.#credentials, state)
  }

  async login(credentials: ICredentialState): Promise<IJWTState> {
    const params = <AxiosRequestConfig>{ params: { ...credentials } }
    return <IJWTState>await this.#httpService.get(this.#loginEndpoint, '', params)
  }

  async register(credentials: ICredentialState): Promise<string> {
    const body = <AxiosRequestConfig>{ ...credentials }
    return <string>await this.#httpService.post(this.#registerEndpoint, '', body)
  }

  async validateUser(username: string): Promise<string> {
    const params = <AxiosRequestConfig>{ params: { username } }
    return <string>await this.#httpService.get(this.#validateEndpoint, '', params)
  }

  setCredentialsState(state: ICredentialState): void {
    this.#credentialsState = { ...this.credentialsState, ...state }
  }
}
