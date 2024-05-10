import { Container, Service } from 'typedi'

import { State } from '@/enums'
import { IModalState } from '@/interfaces'
import { StoreService } from '@/services'

@Service()
export default class ModalService {
  #storeService = Container.get(StoreService)

  #modal: string = State.MODAL

  get modalState() {
    return <IModalState>this.#storeService.getState(this.#modal)
  }

  set #modalState(state: IModalState) {
    this.#storeService.setState(this.#modal, state)
  }

  hideModal(): void {
    const state: IModalState = { ...this.modalState }
    state.isActive && this.#setModalState(state)
  }

  showModal(): void {
    const state: IModalState = { ...this.modalState }
    !state.isActive && this.#setModalState(state)
  }

  #setModalState(state: IModalState): void {
    state.isActive = !state.isActive
    this.#modalState = state
  }
}
