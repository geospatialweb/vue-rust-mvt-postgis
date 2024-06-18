import 'vue/jsx'
import { defineComponent } from 'vue'

import { LayerController, Mapbox, Modal, Trails } from '@/components'
import { mapbox } from '@/configuration'

export default defineComponent({
  name: 'Mapbox View',
  setup() {
    /* prettier-ignore */
    const { options: { container } } = mapbox
    return (): JSX.Element => (
      <section role="presentation">
        <Mapbox container={container} />
        <LayerController />
        <Trails />
        <Modal />
      </section>
    )
  }
})
