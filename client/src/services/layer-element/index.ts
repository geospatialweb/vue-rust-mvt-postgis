import cloneDeep from 'lodash.clonedeep'
import { Container, Service } from 'typedi'

import { LayerId, StoreState } from '@/enums'
import { ILayerElement } from '@/interfaces'
import { LayerVisibilityService, MapboxService, MarkerService, RouterService, StoreService } from '@/services'
import { LayerElementsHashmap } from '@/types'

@Service()
export default class LayerElementService {
  #layerVisibilityService = Container.get(LayerVisibilityService)
  #mapboxService = Container.get(MapboxService)
  #markerService = Container.get(MarkerService)
  #routerService = Container.get(RouterService)
  #storeService = Container.get(StoreService)

  #biosphereLayer: string = LayerId.BIOSPHERE
  #biosphereBorderLayer: string = LayerId.BIOSPHERE_BORDER
  #deckglLayer: string = LayerId.DECKGL
  #layerElementsHashmap: LayerElementsHashmap = {}
  #layerElementsStoreState: string = StoreState.LAYER_ELEMENTS
  #officeLayer: string = LayerId.OFFICE
  #placesLayer: string = LayerId.PLACES
  #satelliteLayer: string = LayerId.SATELLITE
  #trailsLayer: string = LayerId.TRAILS

  constructor() {
    this.#createLayerElementsHashmap()
  }

  get layerElementsState() {
    return <ILayerElement[]>this.#storeService.getStoreState(this.#layerElementsStoreState)
  }

  set #layerElementsState(state: ILayerElement[]) {
    this.#storeService.setStoreState(this.#layerElementsStoreState, state)
  }

  displayLayerElement(id: string): void {
    this.#layerElementsHashmap[id](id)
  }

  #createLayerElementsHashmap(): void {
    this.#layerElementsHashmap = {
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
    this.#setLayerElementsState(id)
    this.#setLayerVisibilityState(id)
    this.#setLayerVisibility(id)
    id === this.#biosphereLayer && this.#setLayerVisibility(this.#biosphereBorderLayer)
    id === this.#trailsLayer && this.#toggleMarkerVisibility(id)
  }

  #marker = (id: string): void => {
    this.#setLayerElementsState(id)
    this.#toggleMarkerVisibility(id)
  }

  #satellite = (id: string): void => {
    this.#setLayerElementsState(id)
    this.#setHiddenMarkersVisibility()
    this.#resetMap()
  }

  #resetMap(): void {
    this.#mapboxService.resetMap()
  }

  #setHiddenMarkersVisibility(): void {
    this.#markerService.setHiddenMarkersVisibility()
  }

  #setLayerElementsState(id: string): void {
    const state = cloneDeep(this.layerElementsState),
      layerElement = (layerElement: ILayerElement): boolean => layerElement.id === id,
      idx = state.findIndex(layerElement)
    if (idx >= 0) state[idx].isActive = !state[idx].isActive
    this.#layerElementsState = state
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
