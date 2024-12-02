import { Container, Service } from 'typedi'

import { Route } from '@/enums'
import { ICredentialsState } from '@/interfaces'
import { CredentialsService, RouterService } from '@/services'

@Service()
export default class RegistrationService {
  async register(credentials: ICredentialsState): Promise<void> {
    const { username } = credentials as { username: string },
      validatedUser = await this.#validateUser(username)
    if (validatedUser) {
      return this.#setCredentialsState({ isCorrect: true, isValid: false })
    }
    const registeredUser = await this.#register(credentials)
    if (!registeredUser) {
      return this.#setCredentialsState({ isCorrect: false, isValid: true })
    }
    this.#setCredentialsState({ isAdmin: false, isCorrect: true, isValid: true, ...credentials })
    await this.#setRoute(Route.Login)
  }

  async #validateUser(username: string): Promise<string> {
    const credentialsService = Container.get(CredentialsService)
    return credentialsService.validateUser(username)
  }

  async #register(credentials: ICredentialsState): Promise<string> {
    const credentialsService = Container.get(CredentialsService)
    return credentialsService.register(credentials)
  }

  async #setRoute(route: string): Promise<void> {
    const routerService = Container.get(RouterService)
    await routerService.setRoute(route)
  }

  #setCredentialsState(state: ICredentialsState): void {
    const credentialsService = Container.get(CredentialsService)
    credentialsService.setCredentialsState(state)
  }
}
