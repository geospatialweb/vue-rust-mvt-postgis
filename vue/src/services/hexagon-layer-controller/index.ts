import { Container, Service } from 'typedi'

import { State } from '@/enums'
import { IHexagonLayerControllerSliderLabelsState } from '@/interfaces'
import { StoreService } from '@/services'

@Service()
export default class HexagonLayerControllerService {
  #storeService = Container.get(StoreService)

  get hexagonLayerControllerSliderLabelsState() {
    return <IHexagonLayerControllerSliderLabelsState>(
      this.#storeService.getState(State.HEXAGON_LAYER_CONTROLLER_SLIDER_LABELS)
    )
  }

  set #hexagonLayerControllerSliderLabelsState(state: IHexagonLayerControllerSliderLabelsState) {
    this.#storeService.setState(State.HEXAGON_LAYER_CONTROLLER_SLIDER_LABELS, state)
  }

  setHexagonLayerControllerSliderLabel(id: string): void {
    const state = <IHexagonLayerControllerSliderLabelsState>{ ...this.hexagonLayerControllerSliderLabelsState }
    state[id as keyof IHexagonLayerControllerSliderLabelsState] =
      !state[id as keyof IHexagonLayerControllerSliderLabelsState]
    this.#hexagonLayerControllerSliderLabelsState = state
  }
}
