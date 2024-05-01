import 'vue/jsx'
import { Container } from 'typedi'
import { defineComponent } from 'vue'

import { IModal } from '@/interfaces'
import { ModalService } from '@/services'
import styles from './index.module.css'

export default defineComponent({
  name: 'Modal Component',
  setup() {
    const { active, inactive } = styles,
      getModalState = (): IModal => {
        const modalService = Container.get(ModalService),
          { modalState } = modalService
        return modalState
      },
      jsx = ({ isActive }: IModal): JSX.Element => <div class={isActive ? active : inactive} role="presentation"></div>
    return (): JSX.Element => jsx(getModalState())
  }
})
