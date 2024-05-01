import { AxiosRequestConfig } from 'axios'
import { Container, Service } from 'typedi'

import { Endpoint, StoreState } from '@/enums'
import { ICredential, IJWT } from '@/interfaces'
import { HttpService, StoreService } from '@/services'

@Service()
export default class CredentialsService {
  #httpService = Container.get(HttpService)
  #storeService = Container.get(StoreService)

  #credentialsStoreState: string = StoreState.CREDENTIALS
  #loginEndpoint: string = Endpoint.LOGIN_ENDPOINT
  #registerEndpoint: string = Endpoint.REGISTER_ENDPOINT
  #validateEndpoint: string = Endpoint.VALIDATE_USER_ENDPOINT

  get credentialsState() {
    return <ICredential>this.#storeService.getStoreState(this.#credentialsStoreState)
  }

  set #credentialsState(state: ICredential) {
    this.#storeService.setStoreState(this.#credentialsStoreState, state)
  }

  async login(credentials: ICredential): Promise<IJWT> {
    const params = <AxiosRequestConfig>{ params: { ...credentials } }
    return <IJWT>await this.#httpService.get(this.#loginEndpoint, '', params)
  }

  async register(credentials: ICredential): Promise<string> {
    const body = <AxiosRequestConfig>{ ...credentials }
    return <string>await this.#httpService.post(this.#registerEndpoint, '', body)
  }

  async validateUser(username: string): Promise<string> {
    const params = <AxiosRequestConfig>{ params: { username } }
    return <string>await this.#httpService.get(this.#validateEndpoint, '', params)
  }

  setCredentialsState(state: ICredential): void {
    this.#credentialsState = { ...this.credentialsState, ...state }
  }
}
