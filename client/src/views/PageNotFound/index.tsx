import { defineComponent } from 'vue'

import { PageNotFound } from '@/components'
import styles from './index.module.css'

export default defineComponent({
  setup() {
    const { pagenotfound } = styles
    return (): JSX.Element => (
      <div class={pagenotfound} role="presentation">
        <PageNotFound />
      </div>
    )
  }
})
