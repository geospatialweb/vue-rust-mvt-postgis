import 'vue/jsx'
import { Container } from 'typedi'
import { defineComponent, onMounted, onUnmounted } from 'vue'

import { AuthorizationService, DeckglService, ModalService } from '@/services'
import styles from './index.module.css'

export default defineComponent({
  name: 'Deckgl Component',
  props: {
    canvas: {
      type: String,
      required: true
    },
    container: {
      type: String,
      required: true
    }
  },
  setup({ canvas, container }) {
    const { deckgl, hexagonlayer } = styles,
      deckglService = Container.get(DeckglService),
      getMapboxAccessToken = async (): Promise<void> => {
        /* prettier-ignore */
        const authorizationService = Container.get(AuthorizationService),
          { jwtState: { jwtToken }, mapboxAccessToken } = authorizationService
        if (!mapboxAccessToken) await authorizationService.getMapboxAccessToken(jwtToken)
      },
      loadHexagonLayer = (): void => deckglService.loadHexagonLayer(),
      removeMapResources = (): void => deckglService.removeMapResources(),
      showModal = (): void => {
        const modalService = Container.get(ModalService)
        modalService.showModal()
      }
    onMounted(async (): Promise<void> => {
      showModal()
      await getMapboxAccessToken()
      loadHexagonLayer()
    })
    onUnmounted((): void => removeMapResources())
    return (): JSX.Element => (
      <div role="presentation">
        <div id={container} class={deckgl} role="presentation"></div>
        <canvas id={canvas} class={hexagonlayer} role="presentation"></canvas>
      </div>
    )
  }
})
