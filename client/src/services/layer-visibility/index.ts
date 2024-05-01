import { Container, Service } from 'typedi'

import { LayerId, StoreState } from '@/enums'
import { ILayerVisibility } from '@/interfaces'
import { StoreService } from '@/services'

@Service()
export default class LayerVisibilityService {
  #storeService = Container.get(StoreService)

  #biosphereLayer: string = LayerId.BIOSPHERE
  #biosphereBorderLayer: string = LayerId.BIOSPHERE_BORDER
  #layerVisibilityStoreState: string = StoreState.LAYER_VISIBILITY

  get layerVisibilityState() {
    return <ILayerVisibility>this.#storeService.getStoreState(this.#layerVisibilityStoreState)
  }

  set #layerVisibilityState(state: ILayerVisibility) {
    this.#storeService.setStoreState(this.#layerVisibilityStoreState, state)
  }

  setLayerVisibilityState(id: string): void {
    const state: ILayerVisibility = { ...this.layerVisibilityState }
    state[id as keyof ILayerVisibility].isActive = !state[id as keyof ILayerVisibility].isActive
    if (id === this.#biosphereLayer) {
      state[this.#biosphereBorderLayer as keyof ILayerVisibility].isActive =
        !state[this.#biosphereBorderLayer as keyof ILayerVisibility].isActive
    }
    this.#layerVisibilityState = state
  }
}
