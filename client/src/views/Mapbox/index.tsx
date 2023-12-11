import { defineComponent } from 'vue'

import { LayerElements, Mapbox, Modal, Trails } from '@/components'
import { mapbox } from '@/configuration'
import styles from './index.module.css'

export default defineComponent({
  setup() {
    /* prettier-ignore */
    const { mapbox: mapboxView } = styles,
      { options: { container } } = mapbox
    return (): JSX.Element => (
      <div class={mapboxView} role="presentation">
        <Mapbox container={container} />
        <LayerElements />
        <Trails />
        <Modal />
      </div>
    )
  }
})
