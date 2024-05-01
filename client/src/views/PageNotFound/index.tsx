import 'vue/jsx'
import { defineComponent } from 'vue'

import { PageNotFound } from '@/components'

export default defineComponent({
  name: 'Page Not Found View',
  setup() {
    return (): JSX.Element => (
      <section role="presentation">
        <PageNotFound />
      </section>
    )
  }
})
