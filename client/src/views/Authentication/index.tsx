import { defineComponent } from 'vue'

import { Authentication } from '@/components'
import styles from './index.module.css'

export default defineComponent({
  setup() {
    const { login } = styles
    return (): JSX.Element => (
      <div class={login} role="presentation">
        <Authentication />
      </div>
    )
  }
})
