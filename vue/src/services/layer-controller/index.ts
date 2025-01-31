import { Container, Service } from 'typedi'

import { Layer, State } from '@/enums'
import { LayerVisibilityService, MapboxService, MarkerVisibilityService, RouterService, StoreService } from '@/services'

import type { ILayerControllerState } from '@/interfaces'
import type { LayerControllerHashmap } from '@/types'

@Service()
export default class LayerControllerService {
  #layerControllerHashmap = <LayerControllerHashmap>{}

  constructor() {
    this.#createLayerControllerHashmap()
  }

  get layerControllerState(): ILayerControllerState[] {
    const { getState } = Container.get(StoreService)
    return <ILayerControllerState[]>getState(State.LayerController)
  }

  set #layerControllerState(state: ILayerControllerState[]) {
    const { setState } = Container.get(StoreService)
    setState(State.LayerController, state)
  }

  displayLayer = (id: string): void => {
    this.#layerControllerHashmap[id](id)
  }

  #createLayerControllerHashmap(): void {
    this.#layerControllerHashmap = {
      [Layer.Biosphere]: this.#layer,
      [Layer.Deckgl]: this.#deckgl,
      [Layer.Office]: this.#marker,
      [Layer.Places]: this.#marker,
      [Layer.Satellite]: this.#satellite,
      [Layer.Trails]: this.#layer
    }
  }

  #deckgl = (id: string): void => {
    const { setRoute } = Container.get(RouterService)
    void setRoute(id)
  }

  #layer = (id: string): void => {
    this.#setLayerControllerState(id)
    this.#setLayerVisibilityState(id)
    this.#setLayerVisibility(id)
    if (id === `${Layer.Biosphere}`) this.#setLayerVisibility(Layer.BiosphereBorder)
    if (id === `${Layer.Trails}`) this.#toggleMarkerVisibility(id)
  }

  #marker = (id: string): void => {
    this.#setLayerControllerState(id)
    this.#toggleMarkerVisibility(id)
  }

  #satellite = (id: string): void => {
    this.#setLayerControllerState(id)
    this.#setHiddenMarkersVisibility()
    this.#resetMap()
  }

  #resetMap(): void {
    const { resetMap } = Container.get(MapboxService)
    resetMap()
  }

  #setHiddenMarkersVisibility(): void {
    const { setHiddenMarkersVisibility } = Container.get(MarkerVisibilityService)
    setHiddenMarkersVisibility()
  }

  #setLayerControllerState(id: string): void {
    const state = <ILayerControllerState[]>[...this.layerControllerState],
      layer = (layer: ILayerControllerState): boolean => layer.id === id,
      idx = state.findIndex(layer)
    if (idx >= 0) state[idx].isActive = !state[idx].isActive
    this.#layerControllerState = state
  }

  #setLayerVisibility(id: string): void {
    const { setLayerVisibility } = Container.get(MapboxService)
    setLayerVisibility(id)
  }

  #setLayerVisibilityState(id: string): void {
    const { setLayerVisibilityState } = Container.get(LayerVisibilityService)
    setLayerVisibilityState(id)
  }

  #toggleMarkerVisibility(id: string): void {
    const { toggleMarkerVisibility } = Container.get(MarkerVisibilityService)
    toggleMarkerVisibility(id)
  }
}
