import 'vue/jsx'
import { defineComponent } from 'vue'

import styles from '../index.module.css'

import type { ILayerControllerState } from '@/interfaces'

export default defineComponent({
  name: 'LayerControllerLayerListItem Component',
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
  setup(props: ILayerControllerState) {
    const { active, inactive } = styles,
      jsx = ({ id, isActive, name }: ILayerControllerState): JSX.Element => (
        <div id={id} class={isActive ? active : inactive}>
          {name}
        </div>
      )
    return (): JSX.Element => jsx(props)
  }
})
