import 'vue/jsx'
import { defineComponent } from 'vue'

import styles from '../index.module.css'

export default defineComponent({
  name: 'LayerIcon',
  props: {
    height: {
      type: String,
      required: true
    },
    id: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    src: {
      type: String,
      required: true
    },
    width: {
      type: String,
      required: true
    }
  },
  setup({ height, id, name, src, width }) {
    return (): JSX.Element => <img id={id} class={styles[id]} alt={name} height={height} src={src} width={width} />
  }
})
