import 'vue/jsx'
import { Container } from 'typedi'
import { defineComponent } from 'vue'

import { IModalState } from '@/interfaces'
import { ModalService } from '@/services'
import styles from './index.module.css'

export default defineComponent({
  name: 'Modal Component',
  setup() {
    const { active, inactive } = styles,
      getModalState = (): IModalState => {
        const modalService = Container.get(ModalService)
        return modalService.modalState
      },
      jsx = ({ isActive }: IModalState): JSX.Element => (
        <div class={isActive ? active : inactive} role="presentation"></div>
      )
    return (): JSX.Element => jsx(getModalState())
  }
})
