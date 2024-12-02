import { Container, Service } from 'typedi'

import { State } from '@/enums'
import { IModalState } from '@/interfaces'
import { StoreService } from '@/services'

@Service()
export default class ModalService {
  get modalState(): IModalState {
    const storeService = Container.get(StoreService)
    return <IModalState>storeService.getState(State.Modal)
  }

  set #modalState(state: IModalState) {
    const storeService = Container.get(StoreService)
    storeService.setState(State.Modal, state)
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
