import { Container, Service } from 'typedi'

import { Route } from '@/enums'
import { AuthorizationService, CredentialsService, MarkerService, RouterService } from '@/services'

import type { ICredentialsState, IJwtState, IUser } from '@/interfaces'

@Service()
export default class AuthenticationService {
  login = async (credentials: ICredentialsState): Promise<void> => {
    const user = await this.#validateUser(credentials)
    if (!user) {
      return this.#setCredentialsState({ ...credentials, isCorrect: true, isValid: false })
    }
    const jwtState = await this.#login(credentials)
    if (!jwtState) {
      return this.#setCredentialsState({ ...credentials, isCorrect: false, isValid: true })
    }
    this.#setCredentialsState({ ...credentials, isCorrect: true, isValid: true })
    this.#setJwtState(jwtState)
    await this.#setMarkerFeatures(jwtState)
    await this.#setRoute(Route.Mapbox)
  }

  async #validateUser(credentials: ICredentialsState): Promise<IUser> {
    const { validateUser } = Container.get(CredentialsService)
    return validateUser(credentials)
  }

  async #login(credentials: ICredentialsState): Promise<IJwtState> {
    const { login } = Container.get(CredentialsService)
    return login(credentials)
  }

  async #setMarkerFeatures({ jwtToken }: IJwtState): Promise<void> {
    const { setMarkerFeatures } = Container.get(MarkerService)
    await setMarkerFeatures(jwtToken)
  }

  async #setRoute(route: string): Promise<void> {
    const { setRoute } = Container.get(RouterService)
    await setRoute(route)
  }

  #setCredentialsState(state: ICredentialsState): void {
    const credentialsService = Container.get(CredentialsService)
    credentialsService.credentialsState = state
  }

  #setJwtState(state: IJwtState): void {
    const authorizationService = Container.get(AuthorizationService)
    authorizationService.jwtState = state
  }
}
