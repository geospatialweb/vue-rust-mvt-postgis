import { Container, Service } from 'typedi'

import { Layer, State } from '@/enums'
import { ILayerVisibilityState } from '@/interfaces'
import { StoreService } from '@/services'

@Service()
export default class LayerVisibilityService {
  get layerVisibilityState(): ILayerVisibilityState {
    const storeService = Container.get(StoreService)
    return <ILayerVisibilityState>storeService.getState(State.LayerVisibility)
  }

  set #layerVisibilityState(state: ILayerVisibilityState) {
    const storeService = Container.get(StoreService)
    storeService.setState(State.LayerVisibility, state)
  }

  setLayerVisibilityState(id: string): void {
    const state = <ILayerVisibilityState>{ ...this.layerVisibilityState }
    state[id as keyof ILayerVisibilityState].isActive = !state[id as keyof ILayerVisibilityState].isActive
    if (id === `${Layer.Biosphere}`) {
      state[Layer.BiosphereBorder as keyof ILayerVisibilityState].isActive =
        !state[Layer.BiosphereBorder as keyof ILayerVisibilityState].isActive
    }
    this.#layerVisibilityState = state
  }
}
