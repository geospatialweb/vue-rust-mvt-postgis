import 'vue/jsx'
import { Container } from 'typedi'
import { defineComponent, onMounted, onUnmounted } from 'vue'

import { DeckglService } from '@/services'
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
      { loadHexagonLayer, removeMapResources } = Container.get(DeckglService)
    onMounted(async (): Promise<void> => await loadHexagonLayer())
    onUnmounted((): void => removeMapResources())
    return (): JSX.Element => (
      <div role="presentation">
        <div id={container} class={deckgl} role="presentation"></div>
        <canvas id={canvas} class={hexagonlayer} role="presentation"></canvas>
      </div>
    )
  }
})
