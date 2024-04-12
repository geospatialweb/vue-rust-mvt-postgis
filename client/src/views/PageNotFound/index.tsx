import 'vue/jsx'
import { defineComponent } from 'vue'

import { PageNotFound } from '@/components'
import styles from './index.module.css'

export default defineComponent({
  setup() {
    const { page_not_found } = styles
    return (): JSX.Element => (
      <div class={page_not_found} role="presentation">
        <PageNotFound />
      </div>
    )
  }
})
