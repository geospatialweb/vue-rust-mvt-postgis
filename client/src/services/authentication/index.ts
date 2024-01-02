import { Container, Service } from 'typedi'

import { routes } from '@/configuration'
import { ICredential, IJWT, IRoutes } from '@/interfaces'
import { AuthorizationService, CredentialsService, MarkerService, RouterService } from '@/services'

@Service()
export default class AuthenticationService {
  #authorizationService = Container.get(AuthorizationService)
  #credentialsService = Container.get(CredentialsService)
  #markerService = Container.get(MarkerService)
  #routerService = Container.get(RouterService)
  #routes: IRoutes = routes

  async login(credentials: ICredential): Promise<void> {
    const username = await this.#validateUser(credentials)
    if (!username) {
      return this.#setCredentialsState({ isCorrect: true, isValid: false })
    }
    const jwt = await this.#login(credentials)
    if (!jwt) {
      this.#consoleError('undefined JWT')
      return this.#setCredentialsState({ isCorrect: false, isValid: true })
    }
    this.#setCredentialsState({ isCorrect: true, isValid: true, ...credentials })
    const { token, expiry } = jwt,
      { mapbox } = this.#routes
    this.#setJWTState({ token, expiry })
    await this.#setMarkerFeatures(token)
    await this.#setRoute(mapbox)
  }

  async #login(credentials: ICredential): Promise<IJWT> {
    return this.#credentialsService.login(credentials)
  }

  async #setMarkerFeatures(token: string): Promise<void> {
    await this.#markerService.setMarkerFeatures(token)
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

  #setJWTState({ token, expiry }: IJWT): void {
    this.#authorizationService.setJWTState({ token, expiry })
  }

  #consoleError(msg: string): void {
    import.meta.env.DEV && console.error(msg)
  }
}
