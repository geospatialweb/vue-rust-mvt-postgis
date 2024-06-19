import { Container, Service } from 'typedi'

import { Layer, State } from '@/enums'
import { ILayerVisibilityState } from '@/interfaces'
import { StoreService } from '@/services'

@Service()
export default class LayerVisibilityService {
  #storeService = Container.get(StoreService)

  #biosphereLayer = `${Layer.BIOSPHERE}`
  #biosphereBorderLayer = `${Layer.BIOSPHERE_BORDER}`

  get layerVisibilityState() {
    return <ILayerVisibilityState>this.#storeService.getState(State.LAYER_VISIBILITY)
  }

  set #layerVisibilityState(state: ILayerVisibilityState) {
    this.#storeService.setState(State.LAYER_VISIBILITY, state)
  }

  setLayerVisibilityState(id: string): void {
    const state = <ILayerVisibilityState>{ ...this.layerVisibilityState }
    state[id as keyof ILayerVisibilityState].isActive = !state[id as keyof ILayerVisibilityState].isActive
    if (id === this.#biosphereLayer) {
      state[this.#biosphereBorderLayer as keyof ILayerVisibilityState].isActive =
        !state[this.#biosphereBorderLayer as keyof ILayerVisibilityState].isActive
    }
    this.#layerVisibilityState = state
  }
}
