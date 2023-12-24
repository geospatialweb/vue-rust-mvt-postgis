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
    const { username } = credentials,
      id = await this.#validateUser(<string>username)
    if (!id) {
      return this.#setCredentialsState({ isCorrect: true, isValid: false })
    }
    const auth = await this.#login(credentials)
    if (!auth) {
      return this.#setCredentialsState({ isCorrect: false, isValid: true })
    }
    this.#setCredentialsState({ isCorrect: true, isValid: true, ...credentials })
    const { token, expiry } = auth
    if (!token || !expiry) {
      return this.#consoleError('undefined JWT')
    }
    const { mapbox } = this.#routes
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

  async #validateUser(username: string): Promise<string> {
    return this.#credentialsService.validateUser(username)
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
