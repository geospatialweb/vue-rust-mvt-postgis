import { AxiosRequestConfig } from 'axios'
import { Container, Service } from 'typedi'

import { State } from '@/enums'
import { ICredentialsState, IJWTState } from '@/interfaces'
import { HttpService, StoreService } from '@/services'

@Service()
export default class CredentialsService {
  #httpService = Container.get(HttpService)
  #storeService = Container.get(StoreService)

  #loginEndpoint = `${import.meta.env.VITE_LOGIN_ENDPOINT}`
  #registerEndpoint: string = `${import.meta.env.VITE_REGISTER_ENDPOINT}`
  #validateEndpoint: string = `${import.meta.env.VITE_VALIDATE_USER_ENDPOINT}`

  get credentialsState() {
    return <ICredentialsState>this.#storeService.getState(State.CREDENTIALS)
  }

  set #credentialsState(state: ICredentialsState) {
    this.#storeService.setState(State.CREDENTIALS, state)
  }

  async login(credentials: ICredentialsState): Promise<IJWTState> {
    const params = <AxiosRequestConfig>{ params: { ...credentials } }
    return <IJWTState>await this.#httpService.get(this.#loginEndpoint, '', params)
  }

  async register(credentials: ICredentialsState): Promise<string> {
    const body = <AxiosRequestConfig>{ ...credentials }
    return <string>await this.#httpService.post(this.#registerEndpoint, '', body)
  }

  async validateUser(username: string): Promise<string> {
    const params = <AxiosRequestConfig>{ params: { username } }
    return <string>await this.#httpService.get(this.#validateEndpoint, '', params)
  }

  setCredentialsState(state: ICredentialsState): void {
    this.#credentialsState = { ...this.credentialsState, ...state }
  }
}
