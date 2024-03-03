import { Container, Service } from 'typedi'

import { LayerId, StoreStates } from '@/enums'
import { ILayerId, ILayerVisibility, IStoreStates } from '@/interfaces'
import { StoreService } from '@/services'

@Service()
export default class LayerVisibilityService {
  #storeService = Container.get(StoreService)
  #layerId: ILayerId = LayerId
  #storeStates: IStoreStates = StoreStates

  get layerVisibilityState() {
    return <ILayerVisibility>this.#storeService.getState(this.#storeStates.LAYER_VISIBILITY)
  }

  set #layerVisibilityState(state: ILayerVisibility) {
    this.#storeService.setState(this.#storeStates.LAYER_VISIBILITY, state)
  }

  setLayerVisibilityState(id: string): void {
    const state: ILayerVisibility = { ...this.layerVisibilityState }
    state[id as keyof ILayerVisibility].isActive = !state[id as keyof ILayerVisibility].isActive
    if (id === this.#layerId.BIOSPHERE) {
      state[this.#layerId.BIOSPHERE_BORDER as keyof ILayerVisibility].isActive =
        !state[this.#layerId.BIOSPHERE_BORDER as keyof ILayerVisibility].isActive
    }
    this.#layerVisibilityState = state
  }
}
