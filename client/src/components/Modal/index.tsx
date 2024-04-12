import 'vue/jsx'
import { Container } from 'typedi'
import { computed, ComputedRef, defineComponent } from 'vue'

import { IModal } from '@/interfaces'
import { ModalService } from '@/services'
import styles from './index.module.css'

export default defineComponent({
  name: 'Modal',
  setup() {
    const { active, inactive } = styles,
      getModalState = (): ComputedRef<IModal> => {
        const modalService = Container.get(ModalService),
          { modalState } = modalService
        return computed((): IModal => modalState)
      },
      jsx = ({ isActive }: IModal): JSX.Element => <div class={isActive ? active : inactive} role="presentation"></div>
    return (): JSX.Element => jsx(getModalState().value)
  }
})
