import { Container, Service } from 'typedi'

import { StoreState } from '@/enums'
import { IHexagonUILabelElement } from '@/interfaces'
import { StoreService } from '@/services'

@Service()
export default class HexagonUIService {
  #storeService = Container.get(StoreService)

  #hexagonUILayerElementStoreState: string = StoreState.HEXAGON_UI_LAYER_ELEMENT

  get hexagonUILabelElementState() {
    return <IHexagonUILabelElement>this.#storeService.getStoreState(this.#hexagonUILayerElementStoreState)
  }

  set #hexagonUILabelElementState(state: IHexagonUILabelElement) {
    this.#storeService.setStoreState(this.#hexagonUILayerElementStoreState, state)
  }

  setHexagonUILabelElementState(id: string): void {
    const state: IHexagonUILabelElement = { ...this.hexagonUILabelElementState }
    state[id as keyof IHexagonUILabelElement] = !state[id as keyof IHexagonUILabelElement]
    this.#hexagonUILabelElementState = state
  }
}
