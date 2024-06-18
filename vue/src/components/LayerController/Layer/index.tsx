import 'vue/jsx'
import { defineComponent } from 'vue'

import { ILayerControllerState } from '@/interfaces'
import styles from '../index.module.css'

export default defineComponent({
  name: 'Layer Component',
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
