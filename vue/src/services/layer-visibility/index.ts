import { Container, Service } from 'typedi'

import { Layer, State } from '@/enums'
import { ILayerVisibilityState } from '@/interfaces'
import { StoreService } from '@/services'

@Service()
export default class LayerVisibilityService {
  #storeService = Container.get(StoreService)

  #biosphereLayer: string = Layer.BIOSPHERE
  #biosphereBorderLayer: string = Layer.BIOSPHERE_BORDER
  #layerVisibility: string = State.LAYER_VISIBILITY

  get layerVisibilityState() {
    return <ILayerVisibilityState>this.#storeService.getState(this.#layerVisibility)
  }

  set #layerVisibilityState(state: ILayerVisibilityState) {
    this.#storeService.setState(this.#layerVisibility, state)
  }

  setLayerVisibilityState(id: string): void {
    const state: ILayerVisibilityState = { ...this.layerVisibilityState }
    state[id as keyof ILayerVisibilityState].isActive = !state[id as keyof ILayerVisibilityState].isActive
    if (id === this.#biosphereLayer) {
      state[this.#biosphereBorderLayer as keyof ILayerVisibilityState].isActive =
        !state[this.#biosphereBorderLayer as keyof ILayerVisibilityState].isActive
    }
    this.#layerVisibilityState = state
  }
}
