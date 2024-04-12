import { AxiosRequestConfig } from 'axios'
import { Container, Service } from 'typedi'

import { Endpoint, StoreStates } from '@/enums'
import { ICredential, IEndpoint, IJWT, IStoreStates } from '@/interfaces'
import { HttpService, StoreService } from '@/services'

@Service()
export default class CredentialsService {
  #httpService = Container.get(HttpService)
  #storeService = Container.get(StoreService)
  #endpoint: IEndpoint = Endpoint
  #storeStates: IStoreStates = StoreStates

  get credentialsState() {
    return <ICredential>this.#storeService.getStoreState(this.#storeStates.CREDENTIALS)
  }

  set #credentialsState(state: ICredential) {
    this.#storeService.setStoreState(this.#storeStates.CREDENTIALS, state)
  }

  async login(credentials: ICredential): Promise<IJWT> {
    const params = <AxiosRequestConfig>{ params: { ...credentials } }
    return <IJWT>await this.#httpService.get(this.#endpoint.LOGIN_ENDPOINT, '', params)
  }

  async register(credentials: ICredential): Promise<string> {
    const body = <AxiosRequestConfig>{ ...credentials }
    return <string>await this.#httpService.post(this.#endpoint.REGISTER_ENDPOINT, '', body)
  }

  async validateUser(username: string): Promise<string> {
    const params = <AxiosRequestConfig>{ params: { username } }
    return <string>await this.#httpService.get(this.#endpoint.VALIDATE_USER_ENDPOINT, '', params)
  }

  setCredentialsState(state: ICredential): void {
    this.#credentialsState = { ...this.credentialsState, ...state }
  }
}
