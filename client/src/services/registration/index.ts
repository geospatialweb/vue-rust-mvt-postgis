import { Container, Service } from 'typedi'

import { routes } from '@/configuration'
import { ICredential, IRoutes } from '@/interfaces'
import { CredentialsService, RouterService } from '@/services'

@Service()
export default class RegistrationService {
  #credentialsService = Container.get(CredentialsService)
  #routerService = Container.get(RouterService)
  #routes: IRoutes = routes

  async register(credentials: ICredential): Promise<void> {
    let username: string
    username = await this.#validateUser(credentials)
    if (username) {
      return this.#setCredentialsState({ isCorrect: true, isValid: false })
    }
    username = await this.#register(credentials)
    if (!username) {
      return this.#setCredentialsState({ isCorrect: false, isValid: true })
    }
    const { login } = this.#routes
    this.#setCredentialsState({ isAdmin: false, isCorrect: true, isValid: true, ...credentials })
    await this.#setRoute(login)
  }

  async #register(credentials: ICredential): Promise<string> {
    return this.#credentialsService.register(credentials)
  }

  async #setRoute(name: string): Promise<void> {
    await this.#routerService.setRoute(name)
  }

  async #validateUser(credentials: ICredential): Promise<string> {
    return this.#credentialsService.validateUser(credentials)
  }

  #setCredentialsState(state: ICredential): void {
    this.#credentialsService.setCredentialsState(state)
  }
}
