import { Container, Service } from 'typedi'

import { StoreStates } from '@/enums'
import { IHexagonUILabelElement, IStoreStates } from '@/interfaces'
import { StoreService } from '@/services'

@Service()
export default class HexagonUIService {
  #storeService = Container.get(StoreService)
  #storeStates: IStoreStates = StoreStates

  get hexagonUILabelElementState() {
    return <IHexagonUILabelElement>this.#storeService.getStoreState(this.#storeStates.HEXAGON_UI_LAYER_ELEMENT)
  }

  set #hexagonUILabelElementState(state: IHexagonUILabelElement) {
    this.#storeService.setStoreState(this.#storeStates.HEXAGON_UI_LAYER_ELEMENT, state)
  }

  setHexagonUILabelElementState(id: string): void {
    const state: IHexagonUILabelElement = { ...this.hexagonUILabelElementState }
    state[id as keyof IHexagonUILabelElement] = !state[id as keyof IHexagonUILabelElement]
    this.#hexagonUILabelElementState = state
  }
}
