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
      { loadMap, removeMapResources } = Container.get(MapboxService),
      { setHiddenMarkersVisibility } = Container.get(MarkerVisibilityService)
    onMounted((): void => loadMap())
    onUnmounted((): void => {
      setHiddenMarkersVisibility()
      removeMapResources()
    })
    return (): JSX.Element => <div id={container} class={mapbox} role="presentation"></div>
  }
})
