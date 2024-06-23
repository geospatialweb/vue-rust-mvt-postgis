import 'vue/jsx'
import { defineComponent } from 'vue'

import { Deckgl, Footer, HexagonLayerController, Modal } from '@/components'
import { deckgl } from '@/configuration'

export default defineComponent({
  name: 'Deckgl View',
  setup() {
    /* prettier-ignore */
    const { options: { canvas, container } } = deckgl
    return (): JSX.Element => (
      <section role="presentation">
        <Deckgl canvas={canvas} container={container} />
        <HexagonLayerController />
        <Footer />
        <Modal />
      </section>
    )
  }
})
