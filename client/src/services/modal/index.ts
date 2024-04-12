import { Container, Service } from 'typedi'

import { StoreStates } from '@/enums'
import { IModal, IStoreStates } from '@/interfaces'
import { StoreService } from '@/services'

@Service()
export default class ModalService {
  #storeService = Container.get(StoreService)
  #storeStates: IStoreStates = StoreStates

  get modalState() {
    return <IModal>this.#storeService.getStoreState(this.#storeStates.MODAL)
  }

  set #modalState(state: IModal) {
    this.#storeService.setStoreState(this.#storeStates.MODAL, state)
  }

  hideModal(): void {
    const state = { ...this.modalState }
    state.isActive && this.#setModalState(state)
  }

  showModal(): void {
    const state = { ...this.modalState }
    !state.isActive && this.#setModalState(state)
  }

  #setModalState(state: IModal): void {
    state.isActive = !state.isActive
    this.#modalState = state
  }
}
