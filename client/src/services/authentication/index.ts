import { Container, Service } from 'typedi'

import { ICredential, IJWT } from '@/interfaces'
import { AuthorizationService, CredentialsService, MarkerService, RouterService } from '@/services'

@Service()
export default class AuthenticationService {
  #authorizationService = Container.get(AuthorizationService)
  #credentialsService = Container.get(CredentialsService)
  #markerService = Container.get(MarkerService)
  #routerService = Container.get(RouterService)

  async login(credentials: ICredential): Promise<void> {
    const { username } = credentials,
      id = await this.#validateUser(<string>username)
    if (!id) {
      return this.#setCredentialsState({ isCorrect: true, isValid: false })
    }
    const auth = await this.#loginUser(credentials)
    if (!auth) {
      return this.#setCredentialsState({ isCorrect: false, isValid: true })
    }
    this.#setCredentialsState({ isCorrect: true, isValid: true, ...credentials })
    const { jwt, jwtExpiry } = auth
    if (!jwt || !jwtExpiry) {
      return this.#consoleError('undefined JWT')
    }
    this.#setJWTState({ jwt, jwtExpiry })
    await this.#setMarkerFeatures(jwt)
    await this.#setRoute('mapbox')
  }

  async #loginUser(credentials: ICredential): Promise<IJWT> {
    return this.#credentialsService.loginUser(credentials)
  }

  async #setMarkerFeatures(jwt: string): Promise<void> {
    await this.#markerService.setMarkerFeatures(jwt)
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

  #setJWTState({ jwt, jwtExpiry }: IJWT): void {
    this.#authorizationService.setJWTState({ jwt, jwtExpiry })
  }

  #consoleError(msg: string): void {
    import.meta.env.DEV && console.error(msg)
  }
}
