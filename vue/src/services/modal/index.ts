import { Container, Service } from 'typedi'

import { State } from '@/enums'
import { IModalState } from '@/interfaces'
import { StoreService } from '@/services'

@Service()
export default class ModalService {
  #storeService = Container.get(StoreService)

  get modalState() {
    return <IModalState>this.#storeService.getState(State.MODAL)
  }

  set #modalState(state: IModalState) {
    this.#storeService.setState(State.MODAL, state)
  }

  hideModal(): void {
    const state = <IModalState>{ ...this.modalState }
    if (state.isActive) {
      state.isActive = !state.isActive
      this.#modalState = state
    }
  }

  showModal(): void {
    const state = <IModalState>{ ...this.modalState }
    if (!state.isActive) {
      state.isActive = !state.isActive
      this.#modalState = state
    }
  }
}
