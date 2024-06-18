import { Container, Service } from 'typedi'

import { Route } from '@/enums'
import { ICredentialsState } from '@/interfaces'
import { CredentialsService, RouterService } from '@/services'

@Service()
export default class RegistrationService {
  #credentialsService = Container.get(CredentialsService)
  #routerService = Container.get(RouterService)

  async register(credentials: ICredentialsState): Promise<void> {
    let { username } = credentials
    username = await this.#validateUser(<string>username)
    if (username) {
      return this.#setCredentialsState({ isCorrect: true, isValid: false })
    }
    username = await this.#register(credentials)
    if (!username) {
      return this.#setCredentialsState({ isCorrect: false, isValid: true })
    }
    this.#setCredentialsState({ isAdmin: false, isCorrect: true, isValid: true, ...credentials })
    await this.#setRoute(Route.LOGIN)
  }

  async #register(credentials: ICredentialsState): Promise<string> {
    return this.#credentialsService.register(credentials)
  }

  async #setRoute(route: string): Promise<void> {
    await this.#routerService.setRoute(route)
  }

  async #validateUser(username: string): Promise<string> {
    return this.#credentialsService.validateUser(username)
  }

  #setCredentialsState(state: ICredentialsState): void {
    this.#credentialsService.setCredentialsState(state)
  }
}
