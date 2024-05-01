import 'vue/jsx'
import { defineComponent } from 'vue'

import { Authentication } from '@/components'

export default defineComponent({
  name: 'Authentication View',
  setup() {
    return (): JSX.Element => (
      <section role="presentation">
        <Authentication />
      </section>
    )
  }
})
