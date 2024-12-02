import 'vue/jsx'
import { Container } from 'typedi'
import { defineComponent, onMounted, onUnmounted } from 'vue'

import { MapboxService, MarkerVisibilityService } from '@/services'
import styles from './index.module.css'

export default defineComponent({
  name: 'Mapbox Component',
  props: {
    container: {
      type: String,
      required: true
    }
  },
  setup({ container }) {
    const { mapbox } = styles,
      mapboxService = Container.get(MapboxService)
    onMounted((): void => mapboxService.loadMap())
    onUnmounted((): void => {
      const markerVisibilityService = Container.get(MarkerVisibilityService)
      markerVisibilityService.setHiddenMarkersVisibility()
      mapboxService.removeMapResources()
    })
    return (): JSX.Element => <div id={container} class={mapbox} role="presentation"></div>
  }
})
