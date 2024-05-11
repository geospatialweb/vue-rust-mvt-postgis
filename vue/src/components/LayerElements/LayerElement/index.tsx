import 'vue/jsx'
import { defineComponent } from 'vue'

import { ILayerElementsState } from '@/interfaces'
import styles from '../index.module.css'

export default defineComponent({
  name: 'LayerElement Component',
  props: {
    id: {
      type: String,
      required: true
    },
    isActive: {
      type: Boolean,
      required: true
    },
    name: {
      type: String,
      required: true
    }
  },
  setup(props: ILayerElementsState) {
    const { active, inactive } = styles,
      jsx = ({ id, isActive, name }: ILayerElementsState): JSX.Element => (
        <div id={id} class={isActive ? active : inactive}>
          {name}
        </div>
      )
    return (): JSX.Element => jsx(props)
  }
})
