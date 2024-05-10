import { Container, Service } from 'typedi'

import { Route } from '@/enums'
import { ICredentialState } from '@/interfaces'
import { CredentialsService, RouterService } from '@/services'

@Service()
export default class RegistrationService {
  #credentialsService = Container.get(CredentialsService)
  #routerService = Container.get(RouterService)

  #loginRoute = Route.LOGIN

  async register(credentials: ICredentialState): Promise<void> {
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
    await this.#setRoute(this.#loginRoute)
  }

  async #register(credentials: ICredentialState): Promise<string> {
    return this.#credentialsService.register(credentials)
  }

  async #setRoute(route: string): Promise<void> {
    await this.#routerService.setRoute(route)
  }

  async #validateUser(username: string): Promise<string> {
    return this.#credentialsService.validateUser(username)
  }

  #setCredentialsState(state: ICredentialState): void {
    this.#credentialsService.setCredentialsState(state)
  }
}
