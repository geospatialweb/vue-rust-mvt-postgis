import { Container, Service } from 'typedi'

import { State } from '@/enums'
import { IHexagonUILabelState } from '@/interfaces'
import { StoreService } from '@/services'

@Service()
export default class HexagonUIService {
  #storeService = Container.get(StoreService)

  get hexagonUILabelState() {
    return <IHexagonUILabelState>this.#storeService.getState(State.HEXAGON_UI_LABEL)
  }

  set #hexagonUILabelState(state: IHexagonUILabelState) {
    this.#storeService.setState(State.HEXAGON_UI_LABEL, state)
  }

  setHexagonUILabelState(id: string): void {
    const state = <IHexagonUILabelState>{ ...this.hexagonUILabelState }
    state[id as keyof IHexagonUILabelState] = !state[id as keyof IHexagonUILabelState]
    this.#hexagonUILabelState = state
  }
}
