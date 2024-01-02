import 'vue/jsx'
import { defineComponent } from 'vue'

import { ILayerElement } from '@/interfaces'
import styles from '../index.module.css'

export default defineComponent({
  name: 'LayerElement',
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
  setup(props: ILayerElement) {
    const { active, inactive } = styles,
      jsx = ({ id, isActive, name }: ILayerElement): JSX.Element => (
        <div id={id} class={isActive ? active : inactive}>
          {name}
        </div>
      )
    return (): JSX.Element => jsx(props)
  }
})
