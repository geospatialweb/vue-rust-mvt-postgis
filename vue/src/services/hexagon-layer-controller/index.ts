import { Container, Service } from 'typedi'

import { State } from '@/enums'
import { IHexagonLayerControllerSliderLabelsState } from '@/interfaces'
import { StoreService } from '@/services'

@Service()
export default class HexagonLayerControllerService {
  get sliderLabelsState(): IHexagonLayerControllerSliderLabelsState {
    const storeService = Container.get(StoreService)
    return <IHexagonLayerControllerSliderLabelsState>storeService.getState(State.HexagonLayerControllerSliderLabels)
  }

  set #sliderLabelsState(state: IHexagonLayerControllerSliderLabelsState) {
    const storeService = Container.get(StoreService)
    storeService.setState(State.HexagonLayerControllerSliderLabels, state)
  }

  setHexagonLayerControllerSliderLabel(id: string): void {
    const state = <IHexagonLayerControllerSliderLabelsState>{ ...this.sliderLabelsState }
    state[id as keyof IHexagonLayerControllerSliderLabelsState] =
      !state[id as keyof IHexagonLayerControllerSliderLabelsState]
    this.#sliderLabelsState = state
  }
}
