import mapboxgl from 'mapbox-gl'
import { Container, Service } from 'typedi'

import { State } from '@/enums'
import { IJwtState } from '@/interfaces'
import { ApiService, LogService, StoreService } from '@/services'

@Service()
export default class AuthorizationService {
  get jwtState(): IJwtState {
    const storeService = Container.get(StoreService)
    return <IJwtState>storeService.getState(State.Jwt)
  }

  get mapboxAccessToken(): string {
    const { accessToken } = mapboxgl
    return accessToken
  }

  set #jwtState(state: IJwtState) {
    const storeService = Container.get(StoreService)
    storeService.setState(State.Jwt, state)
  }

  set #mapboxAccessToken(mapboxAccessToken: string) {
    mapboxgl.accessToken = mapboxAccessToken
  }

  setJWTState(jwtState: IJwtState): void {
    this.#jwtState = jwtState
  }

  async getMapboxAccessToken(jwtToken: string): Promise<void> {
    const apiService = Container.get(ApiService),
      mapboxAccessToken = await apiService.getMapboxAccessToken(jwtToken)
    if (mapboxAccessToken) {
      this.#setMapboxAccessToken(mapboxAccessToken)
    } else {
      const logService = Container.get(LogService)
      logService.logMapboxAccessTokenError(`no ${this.getMapboxAccessToken.name.slice(3)} found`)
    }
  }

  #setMapboxAccessToken(mapboxAccessToken: string): void {
    this.#mapboxAccessToken = mapboxAccessToken
  }
}
