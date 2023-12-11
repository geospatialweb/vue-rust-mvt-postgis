import { defineComponent } from 'vue'

import { Registration } from '@/components'
import styles from './index.module.css'

export default defineComponent({
  setup() {
    const { register } = styles
    return (): JSX.Element => (
      <div class={register} role="presentation">
        <Registration />
      </div>
    )
  }
})
