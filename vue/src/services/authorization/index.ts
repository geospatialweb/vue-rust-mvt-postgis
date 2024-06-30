import mapboxgl from 'mapbox-gl'
import { Container, Service } from 'typedi'

import { State } from '@/enums'
import { IJWTState } from '@/interfaces'
import { ApiService, StoreService } from '@/services'

@Service()
export default class AuthorizationService {
  #apiService = Container.get(ApiService)
  #storeService = Container.get(StoreService)

  get jwtState() {
    return <IJWTState>this.#storeService.getState(State.JWT)
  }

  get mapboxAccessToken() {
    const { accessToken } = mapboxgl
    return accessToken
  }

  set #jwtState(state: IJWTState) {
    this.#storeService.setState(State.JWT, state)
  }

  set #mapboxAccessToken(mapboxAccessToken: string) {
    mapboxgl.accessToken = mapboxAccessToken
  }

  setJWTState(jwtState: IJWTState): void {
    this.#jwtState = jwtState
  }

  async getMapboxAccessToken(jwtToken: string): Promise<void> {
    const mapboxAccessToken = await this.#apiService.getMapboxAccessToken(jwtToken)
    mapboxAccessToken
      ? this.#setMapboxAccessToken(mapboxAccessToken)
      : this.#logConsoleErrorMessage(`no ${this.getMapboxAccessToken.name.slice(3)} found`)
  }

  #setMapboxAccessToken(mapboxAccessToken: string): void {
    this.#mapboxAccessToken = mapboxAccessToken
  }

  #logConsoleErrorMessage(msg: string): void {
    console.error(msg)
  }
}
