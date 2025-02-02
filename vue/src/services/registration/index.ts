import { Container, Service } from 'typedi'

import { Route } from '@/enums'
import { CredentialsService, RouterService } from '@/services'

import type { ICredentialsState, IUser } from '@/interfaces'

@Service()
export default class RegistrationService {
  register = async (credentials: ICredentialsState): Promise<void> => {
    let user = await this.#validateUser(credentials)
    if (user) {
      return this.#setCredentialsState({ ...credentials, isCorrect: true, isValid: false })
    }
    user = await this.#register(credentials)
    if (!user) {
      return this.#setCredentialsState({ ...credentials, isCorrect: false, isValid: true })
    }
    this.#setCredentialsState({ ...credentials, isCorrect: true, isValid: true })
    await this.#setRoute(Route.Login)
  }

  async #validateUser(credentials: ICredentialsState): Promise<IUser> {
    const { validateUser } = Container.get(CredentialsService)
    return validateUser(credentials)
  }

  async #register(credentials: ICredentialsState): Promise<IUser> {
    const { register } = Container.get(CredentialsService)
    return register(credentials)
  }

  async #setRoute(route: string): Promise<void> {
    const { setRoute } = Container.get(RouterService)
    await setRoute(route)
  }

  #setCredentialsState(state: ICredentialsState): void {
    const credentialsService = Container.get(CredentialsService)
    credentialsService.credentialsState = state
  }
}
