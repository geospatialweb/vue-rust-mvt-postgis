import { Container, Service } from 'typedi'

import { Route } from '@/enums'
import { ICredentialsState, IJWTState } from '@/interfaces'
import { AuthorizationService, CredentialsService, MarkerService, RouterService } from '@/services'

@Service()
export default class AuthenticationService {
  #authorizationService = Container.get(AuthorizationService)
  #credentialsService = Container.get(CredentialsService)
  #markerService = Container.get(MarkerService)
  #routerService = Container.get(RouterService)

  async login(credentials: ICredentialsState): Promise<void> {
    let { username } = credentials
    username = await this.#validateUser(<string>username)
    if (!username) {
      return this.#setCredentialsState({ isCorrect: true, isValid: false })
    }
    const jwtState = await this.#login(credentials)
    if (!jwtState) {
      this.#setCredentialsState({ isCorrect: false, isValid: true })
      return this.#consoleError('undefined JWT')
    }
    this.#setCredentialsState({ isCorrect: true, isValid: true, ...credentials })
    this.#setJWTState(jwtState)
    await this.#setMarkerFeatures()
    await this.#setRoute(Route.MAPBOX)
  }

  async #login(credentials: ICredentialsState): Promise<IJWTState> {
    return this.#credentialsService.login(credentials)
  }

  async #setMarkerFeatures(): Promise<void> {
    await this.#markerService.setMarkerFeatures()
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

  #setJWTState(jwtState: IJWTState): void {
    this.#authorizationService.setJWTState(jwtState)
  }

  #consoleError(msg: string): void {
    import.meta.env.DEV && console.error(msg)
  }
}
