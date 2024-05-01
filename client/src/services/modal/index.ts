import { Container, Service } from 'typedi'

import { StoreState } from '@/enums'
import { IModal } from '@/interfaces'
import { StoreService } from '@/services'

@Service()
export default class ModalService {
  #storeService = Container.get(StoreService)

  #modalStoreState: string = StoreState.MODAL

  get modalState() {
    return <IModal>this.#storeService.getStoreState(this.#modalStoreState)
  }

  set #modalState(state: IModal) {
    this.#storeService.setStoreState(this.#modalStoreState, state)
  }

  hideModal(): void {
    const state: IModal = { ...this.modalState }
    state.isActive && this.#setModalState(state)
  }

  showModal(): void {
    const state: IModal = { ...this.modalState }
    !state.isActive && this.#setModalState(state)
  }

  #setModalState(state: IModal): void {
    state.isActive = !state.isActive
    this.#modalState = state
  }
}
