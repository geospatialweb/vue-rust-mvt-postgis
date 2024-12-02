import { Container, Service } from 'typedi'

import { Layer, State } from '@/enums'
import { ILayerControllerState } from '@/interfaces'
import { LayerVisibilityService, MapboxService, MarkerVisibilityService, RouterService, StoreService } from '@/services'
import { LayerControllerHashmap } from '@/types'

@Service()
export default class LayerControllerService {
  #layerControllerHashmap: LayerControllerHashmap = {}

  constructor() {
    this.#createLayerControllerHashmap()
  }

  get layerControllerState(): ILayerControllerState[] {
    const storeService = Container.get(StoreService)
    return <ILayerControllerState[]>storeService.getState(State.LayerController)
  }

  set #layerControllerState(state: ILayerControllerState[]) {
    const storeService = Container.get(StoreService)
    storeService.setState(State.LayerController, state)
  }

  displayLayer(id: string): void {
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
    const routerService = Container.get(RouterService)
    void routerService.setRoute(id)
  }

  #layer = (id: string): void => {
    this.#setLayerControllerState(id)
    this.#setLayerVisibilityState(id)
    this.#setLayerVisibility(id)
    id === `${Layer.Biosphere}` && this.#setLayerVisibility(Layer.BiosphereBorder)
    id === `${Layer.Trails}` && this.#toggleMarkerVisibility(id)
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
    const mapboxService = Container.get(MapboxService)
    mapboxService.resetMap()
  }

  #setHiddenMarkersVisibility(): void {
    const markerVisibilityService = Container.get(MarkerVisibilityService)
    markerVisibilityService.setHiddenMarkersVisibility()
  }

  #setLayerControllerState(id: string): void {
    const state = <ILayerControllerState[]>[...this.layerControllerState],
      layer = (layer: ILayerControllerState): boolean => layer.id === id,
      idx = state.findIndex(layer)
    if (idx >= 0) state[idx].isActive = !state[idx].isActive
    this.#layerControllerState = state
  }

  #setLayerVisibility(id: string): void {
    const mapboxService = Container.get(MapboxService)
    mapboxService.setLayerVisibility(id)
  }

  #setLayerVisibilityState(id: string): void {
    const layerVisibilityService = Container.get(LayerVisibilityService)
    layerVisibilityService.setLayerVisibilityState(id)
  }

  #toggleMarkerVisibility(id: string): void {
    const markerVisibilityService = Container.get(MarkerVisibilityService)
    markerVisibilityService.toggleMarkerVisibility(id)
  }
}
