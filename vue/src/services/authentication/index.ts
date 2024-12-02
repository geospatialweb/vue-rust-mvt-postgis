import { Container, Service } from 'typedi'

import { Error, Route } from '@/enums'
import { ICredentialsState, IJwtState } from '@/interfaces'
import { AuthorizationService, CredentialsService, LogService, MarkerService, RouterService } from '@/services'

@Service()
export default class AuthenticationService {
  async login(credentials: ICredentialsState): Promise<void> {
    const { username } = credentials as { username: string },
      validatedUser = await this.#validateUser(username)
    if (!validatedUser) return this.#setCredentialsState({ isCorrect: true, isValid: false })
    const jwtState = await this.#login(credentials)
    if (!jwtState) {
      const logService = Container.get(LogService)
      logService.logJwtCreationError(Error['undefined jwt'])
      return this.#setCredentialsState({ isCorrect: false, isValid: true })
    }
    this.#setCredentialsState({ isCorrect: true, isValid: true, ...credentials })
    this.#setJWTState(jwtState)
    await this.#setMarkerFeatures(jwtState)
    await this.#setRoute(Route.Mapbox)
  }

  async #validateUser(username: string): Promise<string> {
    const credentialsService = Container.get(CredentialsService)
    return credentialsService.validateUser(username)
  }

  async #login(credentials: ICredentialsState): Promise<IJwtState> {
    const credentialsService = Container.get(CredentialsService)
    return credentialsService.login(credentials)
  }

  async #setMarkerFeatures({ jwtToken }: IJwtState): Promise<void> {
    const markerService = Container.get(MarkerService)
    await markerService.setMarkerFeatures(jwtToken)
  }

  async #setRoute(route: string): Promise<void> {
    const routerService = Container.get(RouterService)
    await routerService.setRoute(route)
  }

  #setCredentialsState(state: ICredentialsState): void {
    const credentialsService = Container.get(CredentialsService)
    credentialsService.setCredentialsState(state)
  }

  #setJWTState(jwtState: IJwtState): void {
    const authorizationService = Container.get(AuthorizationService)
    authorizationService.setJWTState(jwtState)
  }
}
