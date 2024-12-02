import { Container, Service } from 'typedi'

import { mediaQueryCollection } from '@/configuration'
import { State } from '@/enums'
import { IAppState } from '@/interfaces'
import { DeckglService, MapboxService, StoreService, TrailService } from '@/services'
import { MediaQuery, MediaQueryCollection } from '@/types'

@Service()
export default class AppService {
  #mediaQueryCollection: MediaQueryCollection = mediaQueryCollection

  constructor() {
    this.#setAppState()
  }

  get appState(): IAppState {
    const storeService = Container.get(StoreService)
    return <IAppState>storeService.getState(State.App)
  }

  set #appState(state: IAppState) {
    const storeService = Container.get(StoreService)
    storeService.setState(State.App, state)
  }

  setInitialZoom(): void {
    const { initialZoom } = this.appState
    if (initialZoom && Reflect.ownKeys(initialZoom)?.length === 3) {
      const { deckgl, mapbox, trail } = initialZoom,
        deckglService = Container.get(DeckglService),
        mapboxService = Container.get(MapboxService),
        trailService = Container.get(TrailService)
      deckglService.setInitialZoomState(deckgl)
      mapboxService.setInitialZoomState(mapbox)
      trailService.setInitialZoom(trail)
    }
  }

  #setAppState(): void {
    const state = <IAppState>{ ...this.appState }
    state.initialZoom = this.#getInitialZoom()
    state.isMobile = this.#isMobile()
    this.#appState = state
  }

  #getInitialZoom(): MediaQuery {
    const isMatch = ([mediaQuery]: [string, MediaQuery]): boolean => window.matchMedia(mediaQuery).matches,
      mediaQuery = Object.entries(this.#mediaQueryCollection).find(isMatch)
    return mediaQuery && mediaQuery[1]
  }

  #isMobile(): boolean {
    const mobile = /Android|BB|iPad|iPhone|Nokia/i
    return !!navigator.userAgent.match(mobile)
  }
}
