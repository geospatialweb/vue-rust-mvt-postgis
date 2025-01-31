/* eslint-disable */
import { Deck } from '@deck.gl/core'
import { Map } from 'mapbox-gl'
import { Container, Service } from 'typedi'

import { deckgl } from '@/configuration'
import { Event, State } from '@/enums'
import { AuthorizationService, HexagonLayerService, ModalService, StoreService } from '@/services'

import type { LngLatLike } from 'mapbox-gl'
import type { IDeckglOption, IDeckglSettingsState } from '@/interfaces'

@Service()
export default class DeckglService {
  #deckglOptions = <IDeckglOption>deckgl.options

  /* prettier-ignore */
  constructor(private _deck: any, private _map: Map) {}

  get deck(): any {
    return this._deck
  }

  get map(): Map {
    return this._map
  }

  get #deckglSettingsState(): IDeckglSettingsState {
    const { getState } = Container.get(StoreService)
    return <IDeckglSettingsState>getState(State.DeckglSettings)
  }

  set #deckglSettingsState(state: IDeckglSettingsState) {
    const { setState } = Container.get(StoreService)
    setState(State.DeckglSettings, state)
  }

  loadHexagonLayer = async (): Promise<void> => {
    this.#showModal()
    this.#loadDeck()
    await this.#loadMap()
  }

  removeMapResources = (): void => {
    this._map && this._map.remove()
  }

  setInitialDeckZoomState = (zoom: number): void => {
    const state = <IDeckglSettingsState>{ ...this.#deckglSettingsState, zoom }
    this.#setDeckglSettingsState(state)
  }

  #mapJumpTo(): void {
    this._map.jumpTo(this.#deckglSettingsState)
  }

  #loadDeck(): void {
    const { id, canvas, controller } = this.#deckglOptions,
      initialViewState = this.#deckglSettingsState
    this._deck = new Deck({
      id,
      canvas,
      controller,
      initialViewState,
      // @ts-ignore
      onViewStateChange: ({ viewState }): void => {
        const { bearing, latitude, longitude, maxPitch, maxZoom, minZoom, pitch, zoom }: IDeckglSettingsState =
            viewState,
          center = <LngLatLike>[longitude, latitude],
          settings = <IDeckglSettingsState>{
            bearing,
            center,
            latitude,
            longitude,
            maxPitch,
            maxZoom,
            minZoom,
            pitch,
            zoom
          }
        this.#setDeckglSettingsState(settings)
        this.#mapJumpTo()
      },
      getTooltip: ({ object }: Record<string, Record<string, number[]>>): string | null => {
        if (!object) return null
        const { points }: Record<string, number[]> = object
        return `${points.length} Accidents`
      }
    })
  }

  #setDeckglSettingsState(state: IDeckglSettingsState): void {
    this.#deckglSettingsState = state
  }

  async #loadMap(): Promise<void> {
    const { container, interactive, style } = this.#deckglOptions,
      { setMapboxAccessToken } = Container.get(AuthorizationService)
    await setMapboxAccessToken()
    this._map = new Map({ container, interactive, style, ...this.#deckglSettingsState })
      /* prettier-ignore */
      .on(Event.Load, async (): Promise<void> => {
        await this.#renderHexagonLayer()
        this.#hideModal()
      })
  }

  async #renderHexagonLayer(): Promise<void> {
    const { renderHexagonLayer } = Container.get(HexagonLayerService)
    await renderHexagonLayer()
  }

  #hideModal(): void {
    const { hideModal } = Container.get(ModalService)
    hideModal()
  }

  #showModal(): void {
    const { showModal } = Container.get(ModalService)
    showModal()
  }
}
