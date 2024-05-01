import 'vue/jsx'
import { Container } from 'typedi'
import { defineComponent, onMounted, onUnmounted } from 'vue'

import { AuthorizationService, MapboxService, MarkerService, ModalService } from '@/services'
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
      mapboxService = Container.get(MapboxService),
      getMapboxAccessToken = async (): Promise<void> => {
        /* prettier-ignore */
        const authorizationService = Container.get(AuthorizationService),
          { jwtState: { token }, mapboxAccessToken } = authorizationService
        if (!mapboxAccessToken) await authorizationService.getMapboxAccessToken(token)
      },
      loadMap = (): void => mapboxService.loadMap(),
      removeMapResources = (): void => mapboxService.removeMapResources(),
      setHiddenMarkersVisibility = (): void => {
        const markerService = Container.get(MarkerService)
        markerService.setHiddenMarkersVisibility()
      },
      showModal = (): void => {
        const modalService = Container.get(ModalService)
        modalService.showModal()
      }
    onMounted(async (): Promise<void> => {
      showModal()
      await getMapboxAccessToken()
      loadMap()
    })
    onUnmounted((): void => {
      setHiddenMarkersVisibility()
      removeMapResources()
    })
    return (): JSX.Element => <div id={container} class={mapbox} role="presentation"></div>
  }
})
