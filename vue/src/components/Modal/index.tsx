import 'vue/jsx'
import { Container } from 'typedi'
import { defineComponent } from 'vue'

import { ModalService } from '@/services'
import styles from './index.module.css'

import type { IModalState } from '@/interfaces'

export default defineComponent({
  name: 'Modal Component',
  setup() {
    const { active, inactive } = styles,
      getModalState = (): IModalState => {
        const { modalState } = Container.get(ModalService)
        return modalState
      },
      jsx = ({ isActive }: IModalState): JSX.Element => (
        <div class={isActive ? active : inactive} role="presentation"></div>
      )
    return (): JSX.Element => jsx(getModalState())
  }
})
