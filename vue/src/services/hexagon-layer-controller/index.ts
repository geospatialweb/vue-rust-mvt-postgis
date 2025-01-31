import { Container, Service } from 'typedi'

import { State } from '@/enums'
import { StoreService } from '@/services'

import type { IHexagonLayerControllerSliderLabelsState } from '@/interfaces'

@Service()
export default class HexagonLayerControllerService {
  get sliderLabelsState(): IHexagonLayerControllerSliderLabelsState {
    const { getState } = Container.get(StoreService)
    return <IHexagonLayerControllerSliderLabelsState>getState(State.HexagonLayerControllerSliderLabels)
  }

  set #sliderLabelsState(state: IHexagonLayerControllerSliderLabelsState) {
    const { setState } = Container.get(StoreService)
    setState(State.HexagonLayerControllerSliderLabels, state)
  }

  setSliderLabelsState = (id: string): void => {
    const state = <IHexagonLayerControllerSliderLabelsState>{ ...this.sliderLabelsState }
    state[id as keyof IHexagonLayerControllerSliderLabelsState] =
      !state[id as keyof IHexagonLayerControllerSliderLabelsState]
    this.#sliderLabelsState = state
  }
}
