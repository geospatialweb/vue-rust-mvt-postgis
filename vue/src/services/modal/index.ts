import { Container, Service } from 'typedi'

import { State } from '@/enums'
import { StoreService } from '@/services'

import type { IModalState } from '@/interfaces'

@Service()
export default class ModalService {
  get modalState(): IModalState {
    const { getState } = Container.get(StoreService)
    return <IModalState>getState(State.Modal)
  }

  set #modalState(state: IModalState) {
    const { setState } = Container.get(StoreService)
    setState(State.Modal, state)
  }

  hideModal = (): void => {
    const state = <IModalState>{ ...this.modalState }
    if (state.isActive) {
      state.isActive = !state.isActive
      this.#modalState = state
    }
  }

  showModal = (): void => {
    const state = <IModalState>{ ...this.modalState }
    if (!state.isActive) {
      state.isActive = !state.isActive
      this.#modalState = state
    }
  }
}
