import cloneDeep from 'lodash.clonedeep'
import { Container, Service } from 'typedi'

import { LayerId, StoreStates } from '@/enums'
import { ILayerElement, ILayerId, IStoreStates } from '@/interfaces'
import { LayerVisibilityService, MapboxService, MarkerService, RouterService, StoreService } from '@/services'
import { LayerElementsHashmap } from '@/types'

@Service()
export default class LayerElementService {
  #layerVisibilityService = Container.get(LayerVisibilityService)
  #mapboxService = Container.get(MapboxService)
  #markerService = Container.get(MarkerService)
  #routerService = Container.get(RouterService)
  #storeService = Container.get(StoreService)
  #layerElementsHashmap: LayerElementsHashmap = {}
  #layerId: ILayerId = LayerId
  #storeStates: IStoreStates = StoreStates

  constructor() {
    this.#createLayerElementsHashmap()
  }

  get layerElementsState() {
    return <ILayerElement[]>this.#storeService.getStoreState(this.#storeStates.LAYER_ELEMENTS)
  }

  set #layerElementsState(state: ILayerElement[]) {
    this.#storeService.setStoreState(this.#storeStates.LAYER_ELEMENTS, state)
  }

  displayLayerElement(id: LayerId): void {
    this.#layerElementsHashmap[id](id)
  }

  #createLayerElementsHashmap(): void {
    this.#layerElementsHashmap = {
      [this.#layerId.BIOSPHERE]: this.#layer,
      [this.#layerId.DECKGL]: this.#deckgl,
      [this.#layerId.OFFICE]: this.#marker,
      [this.#layerId.PLACES]: this.#marker,
      [this.#layerId.SATELLITE]: this.#satellite,
      [this.#layerId.TRAILS]: this.#layer
    }
  }

  #deckgl = (id: LayerId): void => {
    void this.#routerService.setRoute(id)
  }

  #layer = (id: LayerId): void => {
    this.#setLayerElementsState(id)
    this.#setLayerVisibilityState(id)
    this.#setLayerVisibility(id)
    id === <LayerId>this.#layerId.BIOSPHERE && this.#setLayerVisibility(<LayerId>this.#layerId.BIOSPHERE_BORDER)
    id === <LayerId>this.#layerId.TRAILS && this.#toggleMarkerVisibility(id)
  }

  #marker = (id: LayerId): void => {
    this.#setLayerElementsState(id)
    this.#toggleMarkerVisibility(id)
  }

  #satellite = (id: LayerId): void => {
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

  #setLayerElementsState(id: LayerId): void {
    const state = cloneDeep(this.layerElementsState),
      layerElement = (layerElement: ILayerElement): boolean => <LayerId>layerElement.id === id,
      idx = state.findIndex(layerElement)
    if (idx >= 0) state[idx].isActive = !state[idx].isActive
    this.#layerElementsState = state
  }

  #setLayerVisibility(id: LayerId): void {
    this.#mapboxService.setLayerVisibility(id)
  }

  #setLayerVisibilityState(id: LayerId): void {
    this.#layerVisibilityService.setLayerVisibilityState(id)
  }

  #toggleMarkerVisibility(id: LayerId): void {
    this.#markerService.toggleMarkerVisibility(id)
  }
}
