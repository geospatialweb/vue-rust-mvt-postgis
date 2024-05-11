import { Container, Service } from 'typedi'

import { mediaQueryCollection } from '@/configuration'
import { State } from '@/enums'
import { IAppState } from '@/interfaces'
import { DeckglService, MapboxService, StoreService, TrailService } from '@/services'
import { MediaQuery, MediaQueryCollection } from '@/types'

@Service()
export default class AppService {
  #deckglService = Container.get(DeckglService)
  #mapboxService = Container.get(MapboxService)
  #storeService = Container.get(StoreService)
  #trailService = Container.get(TrailService)

  #app: string = State.APP
  #mediaQueryCollection: MediaQueryCollection = mediaQueryCollection

  constructor() {
    this.#setAppState()
  }

  get appState() {
    return <IAppState>this.#storeService.getState(this.#app)
  }

  set #appState(state: IAppState) {
    this.#storeService.setState(this.#app, state)
  }

  setInitialZoom(): void {
    const { initialZoom } = this.appState
    if (initialZoom && Reflect.ownKeys(initialZoom)?.length === 3) {
      const { deckgl, mapbox, trail } = initialZoom
      this.#deckglService.setInitialZoomState(deckgl)
      this.#mapboxService.setInitialZoomState(mapbox)
      this.#trailService.setInitialZoom(trail)
    }
  }

  #setAppState(): void {
    const state: IAppState = { ...this.appState }
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
