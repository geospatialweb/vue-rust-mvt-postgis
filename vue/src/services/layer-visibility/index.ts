import { Container, Service } from 'typedi'

import { Layer, State } from '@/enums'
import { StoreService } from '@/services'

import type { ILayerVisibilityState } from '@/interfaces'

@Service()
export default class LayerVisibilityService {
  get layerVisibilityState(): ILayerVisibilityState {
    const { getState } = Container.get(StoreService)
    return <ILayerVisibilityState>getState(State.LayerVisibility)
  }

  set #layerVisibilityState(state: ILayerVisibilityState) {
    const { setState } = Container.get(StoreService)
    setState(State.LayerVisibility, state)
  }

  setLayerVisibilityState = (id: string): void => {
    const state = <ILayerVisibilityState>{ ...this.layerVisibilityState }
    state[id as keyof ILayerVisibilityState].isActive = !state[id as keyof ILayerVisibilityState].isActive
    if (id === `${Layer.Biosphere}`) {
      state[Layer.BiosphereBorder as keyof ILayerVisibilityState].isActive =
        !state[Layer.BiosphereBorder as keyof ILayerVisibilityState].isActive
    }
    this.#layerVisibilityState = state
  }
}
