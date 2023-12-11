import mapboxgl from 'mapbox-gl'
import { Container, Service } from 'typedi'

import { StoreStates } from '@/enums'
import { IJWT, IStoreStates } from '@/interfaces'
import { ApiService, StoreService } from '@/services'

@Service()
export default class AuthorizationService {
  #apiService = Container.get(ApiService)
  #storeService = Container.get(StoreService)
  #storeStates: IStoreStates = StoreStates

  get jwtState(): IJWT {
    return <IJWT>this.#storeService.getState(this.#storeStates.JWT)
  }

  get mapboxAccessToken(): string {
    const { accessToken } = mapboxgl
    return accessToken
  }

  set #jwtState(state: IJWT) {
    this.#storeService.setState(this.#storeStates.JWT, state)
  }

  set #mapboxAccessToken(token: string) {
    mapboxgl.accessToken = token
  }

  setJWTState({ jwt, jwtExpiry }: IJWT): void {
    this.#jwtState = { jwt, jwtExpiry }
  }

  async getMapboxAccessToken(jwt: string): Promise<void> {
    const token = await this.#apiService.getMapboxAccessToken(jwt)
    token
      ? this.#setMapboxAccessToken(token)
      : this.#consoleError(`no ${this.getMapboxAccessToken.name.slice(3)} found`)
  }

  #setMapboxAccessToken(token: string): void {
    this.#mapboxAccessToken = token
  }

  #consoleError(msg: string): void {
    import.meta.env.DEV && console.error(msg)
  }
}
