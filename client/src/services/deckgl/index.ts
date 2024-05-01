/* eslint-disable */
import { Deck } from '@deck.gl/core'
import { LngLatLike, Map } from 'mapbox-gl'
import { Container, Service } from 'typedi'

import { deckgl } from '@/configuration'
import { StoreState } from '@/enums'
import { IDeckglOption, IDeckglSetting } from '@/interfaces'
import { HexagonLayerService, ModalService, StoreService } from '@/services'

@Service()
export default class DeckglService {
  #hexagonLayerService = Container.get(HexagonLayerService)
  #modalService = Container.get(ModalService)
  #storeService = Container.get(StoreService)

  #deckglOptions: IDeckglOption = deckgl.options
  #deckglSettingsStoreState: string = StoreState.DECKGL_SETTINGS

  constructor(
    private _deck: any,
    private _map: Map
  ) {}

  get deck() {
    return this._deck
  }

  get #deckglSettingsState() {
    return <IDeckglSetting>this.#storeService.getStoreState(this.#deckglSettingsStoreState)
  }

  set #deckglSettingsState(state: IDeckglSetting) {
    this.#storeService.setStoreState(this.#deckglSettingsStoreState, state)
  }

  loadHexagonLayer(): void {
    this.#loadDeck()
    this.#loadMap()
  }

  removeMapResources(): void {
    this._map && this._map.remove()
  }

  setInitialZoomState(zoom: number): void {
    const state: IDeckglSetting = { ...this.#deckglSettingsState, zoom }
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
          state: IDeckglSetting = { bearing, center, latitude, longitude, maxPitch, maxZoom, minZoom, pitch, zoom }
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

  #loadMap(): void {
    const { container, interactive, style } = this.#deckglOptions
    this._map = new Map({ container, interactive, style, ...this.#deckglSettingsState }).on('load', (): void => {
      this.#renderHexagonLayer()
      this.#hideModal()
    })
  }

  #setDeckglSettingsState(state: IDeckglSetting): void {
    this.#deckglSettingsState = state
  }

  #mapJumpTo(): void {
    this._map.jumpTo(this.#deckglSettingsState)
  }

  #renderHexagonLayer(): void {
    this.#hexagonLayerService.renderHexagonLayer()
  }

  #hideModal(): void {
    window.setTimeout((): void => this.#modalService.hideModal(), 250)
  }
}
