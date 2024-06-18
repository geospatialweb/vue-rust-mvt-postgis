/* eslint-disable */
import { Deck } from '@deck.gl/core'
import { LngLatLike, Map } from 'mapbox-gl'
import { Container, Service } from 'typedi'

import { deckgl } from '@/configuration'
import { State } from '@/enums'
import { IDeckglOption, IDeckglSettingsState } from '@/interfaces'
import { AuthorizationService, HexagonLayerService, ModalService, StoreService } from '@/services'

@Service()
export default class DeckglService {
  #authorizationService = Container.get(AuthorizationService)
  #hexagonLayerService = Container.get(HexagonLayerService)
  #modalService = Container.get(ModalService)
  #storeService = Container.get(StoreService)

  #deckglOptions: IDeckglOption = deckgl.options

  /* prettier-ignore */
  constructor(private _deck: any, private _map: Map) {}

  get deck() {
    return this._deck
  }

  get map() {
    return this._map
  }

  get #deckglSettingsState() {
    return <IDeckglSettingsState>this.#storeService.getState(State.DECKGL_SETTINGS)
  }

  set #deckglSettingsState(state: IDeckglSettingsState) {
    this.#storeService.setState(State.DECKGL_SETTINGS, state)
  }

  loadHexagonLayer(): void {
    this.#showModal()
    this.#loadDeck()
    void this.#loadMap()
  }

  removeMapResources(): void {
    this._map && this._map.remove()
  }

  setInitialZoomState(zoom: number): void {
    const state = <IDeckglSettingsState>{ ...this.#deckglSettingsState, zoom }
    this.#setDeckglSettingsState(state)
  }

  #loadDeck(): void {
    const { id, canvas, controller } = this.#deckglOptions,
      initialViewState = this.#deckglSettingsState
    this._deck = new Deck({
      id,
      canvas,
      controller,
      initialViewState,
      onViewStateChange: (viewState: any): void => {
        /* prettier-ignore */
        const { viewState: { bearing, latitude, longitude, maxPitch, maxZoom, minZoom, pitch, zoom } } = viewState,
          center: LngLatLike = [longitude, latitude],
          state: IDeckglSettingsState = { bearing, center, latitude, longitude, maxPitch, maxZoom, minZoom, pitch, zoom }
        this.#setDeckglSettingsState(state)
        this.#mapJumpTo()
      },
      getTooltip: ({ object }: Record<string, Record<string, number[]>>): string | null => {
        if (!object) return null
        const { points }: Record<string, number[]> = object
        return `${points.length} Accidents`
      }
    })
  }

  async #loadMap(): Promise<void> {
    const { container, interactive, style } = this.#deckglOptions
    await this.#getMapboxAccessToken()
    this._map = new Map({ container, interactive, style, ...this.#deckglSettingsState }).on('load', (): void => {
      this.#renderHexagonLayer()
      this.#hideModal()
    })
  }

  #getMapboxAccessToken = async (): Promise<void> => {
    const authorizationService = this.#authorizationService,
      { mapboxAccessToken } = authorizationService
    if (!mapboxAccessToken) {
      /* prettier-ignore */
      const { jwtState: { jwtToken } } = authorizationService
      await authorizationService.getMapboxAccessToken(jwtToken)
    }
  }

  #setDeckglSettingsState(state: IDeckglSettingsState): void {
    this.#deckglSettingsState = state
  }

  #mapJumpTo(): void {
    this._map.jumpTo(this.#deckglSettingsState)
  }

  #renderHexagonLayer(): void {
    this.#hexagonLayerService.renderHexagonLayer()
  }

  #hideModal(): void {
    window.setTimeout((): void => this.#modalService.hideModal(), 200)
  }

  #showModal = (): void => {
    this.#modalService.showModal()
  }
}
