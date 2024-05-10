import { Container, Service } from 'typedi'

import { State } from '@/enums'
import { IHexagonUILabelState } from '@/interfaces'
import { StoreService } from '@/services'

@Service()
export default class HexagonUIService {
  #storeService = Container.get(StoreService)

  #hexagonUILabel: string = State.HEXAGON_UI_LABEL

  get hexagonUILabelState() {
    return <IHexagonUILabelState>this.#storeService.getState(this.#hexagonUILabel)
  }

  set #hexagonUILabelState(state: IHexagonUILabelState) {
    this.#storeService.setState(this.#hexagonUILabel, state)
  }

  setHexagonUILabelState(id: string): void {
    const state: IHexagonUILabelState = { ...this.hexagonUILabelState }
    state[id as keyof IHexagonUILabelState] = !state[id as keyof IHexagonUILabelState]
    this.#hexagonUILabelState = state
  }
}
