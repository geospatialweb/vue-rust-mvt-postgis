import { Container, Service } from 'typedi'

import { ICredential } from '@/interfaces'
import { CredentialsService, RouterService } from '@/services'

@Service()
export default class RegistrationService {
  #credentialsService = Container.get(CredentialsService)
  #routerService = Container.get(RouterService)

  async register(credentials: ICredential): Promise<void> {
    const { username } = credentials,
      id = await this.#validateUser(<string>username)
    if (id) {
      return this.#setCredentialsState({ isCorrect: true, isValid: false })
    }
    const userName = await this.#registerUser(credentials)
    if (userName !== <string>username) {
      return this.#setCredentialsState({ isCorrect: false, isValid: true })
    }
    this.#setCredentialsState({ isAdmin: false, isCorrect: true, isValid: true, ...credentials })
    await this.#setRoute('login')
  }

  async #registerUser(credentials: ICredential): Promise<string> {
    return this.#credentialsService.registerUser(credentials)
  }

  async #setRoute(name: string): Promise<void> {
    await this.#routerService.setRoute(name)
  }

  async #validateUser(username: string): Promise<string> {
    return this.#credentialsService.validateUser(username)
  }

  #setCredentialsState(state: ICredential): void {
    this.#credentialsService.setCredentialsState(state)
  }
}
