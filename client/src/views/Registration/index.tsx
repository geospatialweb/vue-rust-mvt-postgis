import 'vue/jsx'
import { defineComponent } from 'vue'

import { Registration } from '@/components'

export default defineComponent({
  name: 'Registration View',
  setup() {
    return (): JSX.Element => (
      <section role="presentation">
        <Registration />
      </section>
    )
  }
})
