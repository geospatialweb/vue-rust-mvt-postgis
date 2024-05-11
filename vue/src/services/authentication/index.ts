import { Container, Service } from 'typedi'

import { Route } from '@/enums'
import { ICredentialState, IJWTState } from '@/interfaces'
import { AuthorizationService, CredentialsService, MarkerService, RouterService } from '@/services'

@Service()
export default class AuthenticationService {
  #authorizationService = Container.get(AuthorizationService)
  #credentialsService = Container.get(CredentialsService)
  #markerService = Container.get(MarkerService)
  #routerService = Container.get(RouterService)

  #mapboxRoute = Route.MAPBOX

  async login(credentials: ICredentialState): Promise<void> {
    let { username } = credentials
    username = await this.#validateUser(<string>username)
    if (!username) {
      return this.#setCredentialsState({ isCorrect: true, isValid: false })
    }
    const jwt = await this.#login(credentials)
    if (!jwt) {
      this.#consoleError('undefined JWT')
      return this.#setCredentialsState({ isCorrect: false, isValid: true })
    }
    this.#setCredentialsState({ isCorrect: true, isValid: true, ...credentials })
    const { token, expiry } = jwt
    this.#setJWTState({ token, expiry })
    await this.#setMarkerFeatures(token)
    await this.#setRoute(this.#mapboxRoute)
  }

  async #login(credentials: ICredentialState): Promise<IJWTState> {
    return this.#credentialsService.login(credentials)
  }

  async #setMarkerFeatures(token: string): Promise<void> {
    await this.#markerService.setMarkerFeatures(token)
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

  #setJWTState({ token, expiry }: IJWTState): void {
    this.#authorizationService.setJWTState({ token, expiry })
  }

  #consoleError(msg: string): void {
    import.meta.env.DEV && console.error(msg)
  }
}
