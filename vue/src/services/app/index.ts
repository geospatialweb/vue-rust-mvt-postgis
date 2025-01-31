import { Container, Service } from 'typedi'

import { mediaQueryCollection } from '@/configuration'
import { State } from '@/enums'
import { DeckglService, MapboxService, StoreService, TrailService } from '@/services'

import type { IAppState } from '@/interfaces'
import type { MediaQuery, MediaQueryCollection } from '@/types'

@Service()
export default class AppService {
  #mediaQueryCollection = <MediaQueryCollection>mediaQueryCollection

  get appState(): IAppState {
    const { getState } = Container.get(StoreService)
    return <IAppState>getState(State.App)
  }

  set #appState(state: IAppState) {
    const { setState } = Container.get(StoreService)
    setState(State.App, state)
  }

  setAppState = (): void => {
    const state = <IAppState>{ ...this.appState }
    state.initialZoom = this.#getInitialZoom()
    state.isMobile = this.#isMobile()
    this.#appState = state
  }

  setInitialZoom = (): void => {
    const { initialZoom } = this.appState
    if (initialZoom && Reflect.ownKeys(initialZoom)?.length === 3) {
      const { deckgl, mapbox, trail } = initialZoom,
        { setInitialDeckZoomState } = Container.get(DeckglService),
        { setInitialMapZoomState } = Container.get(MapboxService),
        { setInitialZoom } = Container.get(TrailService)
      setInitialDeckZoomState(deckgl)
      setInitialMapZoomState(mapbox)
      setInitialZoom(trail)
    }
  }

  #getInitialZoom(): MediaQuery {
    const isMatch = ([mediaQuery]: [string, MediaQuery]): boolean => window.matchMedia(mediaQuery).matches,
      mediaQuery = Object.entries(this.#mediaQueryCollection).find(isMatch)
    return mediaQuery && mediaQuery[1]
  }

  #isMobile(): boolean {
    const mobile = /Android|BB|iPad|iPhone|Nokia/i
    return !!mobile.exec(navigator.userAgent)
  }
}
