import mapboxgl from 'mapbox-gl'
import { Container, Service } from 'typedi'

import { State } from '@/enums'
import { ApiService, CredentialsService, StoreService } from '@/services'

import type { IJwtState } from '@/interfaces'
import type { MapboxAccessToken } from '@/types'

@Service()
export default class AuthorizationService {
  get jwtState(): IJwtState {
    const { getState } = Container.get(StoreService)
    return <IJwtState>getState(State.Jwt)
  }

  set jwtState(state: IJwtState) {
    const { setState } = Container.get(StoreService)
    setState(State.Jwt, state)
  }

  get #mapboxAccessToken(): MapboxAccessToken {
    return mapboxgl.accessToken
  }

  set #mapboxAccessToken(token: string) {
    mapboxgl.accessToken = token
  }

  setMapboxAccessToken = async (): Promise<void> => {
    if (!this.#mapboxAccessToken) {
      const { jwtToken } = this.jwtState,
        { credentialsState: credentials } = Container.get(CredentialsService),
        { getMapboxAccessToken } = Container.get(ApiService),
        { token } = await getMapboxAccessToken(credentials, jwtToken)
      this.#mapboxAccessToken = token
    }
  }
}
