import 'vue/jsx'
import { Container } from 'typedi'
import { defineComponent, onMounted, onUnmounted } from 'vue'

import { AuthorizationService, MapboxService, MarkerService, ModalService } from '@/services'
import styles from './index.module.css'

export default defineComponent({
  name: 'Mapbox',
  props: {
    container: {
      type: String,
      required: true
    }
  },
  setup({ container }) {
    const { mapbox } = styles,
      authorizationService = Container.get(AuthorizationService),
      mapboxService = Container.get(MapboxService),
      markerService = Container.get(MarkerService),
      modalService = Container.get(ModalService),
      getMapboxAccessToken = async (): Promise<void> => {
        /* prettier-ignore */
        const { jwtState: { token }, mapboxAccessToken } = authorizationService
        if (!mapboxAccessToken) await authorizationService.getMapboxAccessToken(token)
      },
      loadMap = (): void => mapboxService.loadMap(),
      removeMapResources = (): void => mapboxService.removeMapResources(),
      setHiddenMarkersVisibility = (): void => markerService.setHiddenMarkersVisibility(),
      showModal = (): void => modalService.showModal()
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
