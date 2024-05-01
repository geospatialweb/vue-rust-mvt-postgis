import mapboxgl from 'mapbox-gl'
import { Container, Service } from 'typedi'

import { StoreState } from '@/enums'
import { IJWT } from '@/interfaces'
import { ApiService, StoreService } from '@/services'

@Service()
export default class AuthorizationService {
  #apiService = Container.get(ApiService)
  #storeService = Container.get(StoreService)

  #jwtStoreState: string = StoreState.JWT

  get jwtState() {
    return <IJWT>this.#storeService.getStoreState(this.#jwtStoreState)
  }

  get mapboxAccessToken() {
    const { accessToken } = mapboxgl
    return accessToken
  }

  set #jwtState(state: IJWT) {
    this.#storeService.setStoreState(this.#jwtStoreState, state)
  }

  set #mapboxAccessToken(mapboxAccessToken: string) {
    mapboxgl.accessToken = mapboxAccessToken
  }

  setJWTState({ token, expiry }: IJWT): void {
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
