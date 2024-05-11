import mapboxgl from 'mapbox-gl'
import { Container, Service } from 'typedi'

import { State } from '@/enums'
import { IJWTState } from '@/interfaces'
import { ApiService, StoreService } from '@/services'

@Service()
export default class AuthorizationService {
  #apiService = Container.get(ApiService)
  #storeService = Container.get(StoreService)

  #jwt: string = State.JWT

  get jwtState() {
    return <IJWTState>this.#storeService.getState(this.#jwt)
  }

  get mapboxAccessToken() {
    const { accessToken } = mapboxgl
    return accessToken
  }

  set #jwtState(state: IJWTState) {
    this.#storeService.setState(this.#jwt, state)
  }

  set #mapboxAccessToken(mapboxAccessToken: string) {
    mapboxgl.accessToken = mapboxAccessToken
  }

  setJWTState({ token, expiry }: IJWTState): void {
    this.#jwtState = { token, expiry }
  }

  async getMapboxAccessToken(token: string): Promise<void> {
    const mapboxAccessToken = await this.#apiService.getMapboxAccessToken(token)
    mapboxAccessToken
      ? this.#setMapboxAccessToken(mapboxAccessToken)
      : this.#consoleError(`no ${this.getMapboxAccessToken.name.slice(3)} found`)
  }

  #setMapboxAccessToken(mapboxAccessToken: string): void {
    this.#mapboxAccessToken = mapboxAccessToken
  }

  #consoleError(msg: string): void {
    import.meta.env.DEV && console.error(msg)
  }
}
