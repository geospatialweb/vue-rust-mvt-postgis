import { Container, Service } from 'typedi'

import { Layer, State } from '@/enums'
import { ILayerControllerState } from '@/interfaces'
import { LayerVisibilityService, MapboxService, MarkerService, RouterService, StoreService } from '@/services'
import { LayerControllerHashmap } from '@/types'

@Service()
export default class LayerControllerService {
  #layerVisibilityService = Container.get(LayerVisibilityService)
  #mapboxService = Container.get(MapboxService)
  #markerService = Container.get(MarkerService)
  #routerService = Container.get(RouterService)
  #storeService = Container.get(StoreService)

  #layerControllerHashmap: LayerControllerHashmap = {}

  #biosphereLayer = `${Layer.BIOSPHERE}`
  #biosphereBorderLayer = `${Layer.BIOSPHERE_BORDER}`
  #deckglLayer = `${Layer.DECKGL}`
  #officeLayer = `${Layer.OFFICE}`
  #placesLayer = `${Layer.PLACES}`
  #satelliteLayer = `${Layer.SATELLITE}`
  #trailsLayer = `${Layer.TRAILS}`

  constructor() {
    this.#createLayerControllerHashmap()
  }

  get layerControllerState() {
    return <ILayerControllerState[]>this.#storeService.getState(State.LAYER_CONTROLLER)
  }

  set #layerControllerState(state: ILayerControllerState[]) {
    this.#storeService.setState(State.LAYER_CONTROLLER, state)
  }

  displayLayer(id: string): void {
    this.#layerControllerHashmap[id](id)
  }

  #createLayerControllerHashmap(): void {
    this.#layerControllerHashmap = {
      [this.#biosphereLayer]: this.#layer,
      [this.#deckglLayer]: this.#deckgl,
      [this.#officeLayer]: this.#marker,
      [this.#placesLayer]: this.#marker,
      [this.#satelliteLayer]: this.#satellite,
      [this.#trailsLayer]: this.#layer
    }
  }

  #deckgl = (id: string): void => {
    void this.#routerService.setRoute(id)
  }

  #layer = (id: string): void => {
    this.#setLayerControllerState(id)
    this.#setLayerVisibilityState(id)
    this.#setLayerVisibility(id)
    id === this.#biosphereLayer && this.#setLayerVisibility(this.#biosphereBorderLayer)
    id === this.#trailsLayer && this.#toggleMarkerVisibility(id)
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
    this.#mapboxService.resetMap()
  }

  #setHiddenMarkersVisibility(): void {
    this.#markerService.setHiddenMarkersVisibility()
  }

  #setLayerControllerState(id: string): void {
    const state = <ILayerControllerState[]>[...this.layerControllerState],
      layer = (layer: ILayerControllerState): boolean => layer.id === id,
      idx = state.findIndex(layer)
    if (idx >= 0) state[idx].isActive = !state[idx].isActive
    this.#layerControllerState = state
  }

  #setLayerVisibility(id: string): void {
    this.#mapboxService.setLayerVisibility(id)
  }

  #setLayerVisibilityState(id: string): void {
    this.#layerVisibilityService.setLayerVisibilityState(id)
  }

  #toggleMarkerVisibility(id: string): void {
    this.#markerService.toggleMarkerVisibility(id)
  }
}
