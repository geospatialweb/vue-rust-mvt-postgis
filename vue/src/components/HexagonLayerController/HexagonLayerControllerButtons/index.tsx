import 'vue/jsx'
import { Container } from 'typedi'
import { defineComponent } from 'vue'

import { hexagonLayerControllerButtons } from '@/configuration'
import { HexagonLayerService, RouterService } from '@/services'

import type { IHexagonLayerControllerButton } from '@/interfaces'

export default defineComponent({
  name: 'HexagonLayerControllerButtons Component',
  props: {
    id: {
      type: String,
      required: true
    }
  },
  setup({ id }, { slots }) {
    const onClickHandler = (evt: MouseEvent): void => {
      evt.stopPropagation()
      const { id } = evt.target as HTMLButtonElement,
        buttons: IHexagonLayerControllerButton[] = hexagonLayerControllerButtons
      if (id === buttons[0].id) {
        const { resetHexagonLayerState } = Container.get(HexagonLayerService)
        void resetHexagonLayerState()
      } else {
        const { setRoute } = Container.get(RouterService)
        void setRoute(id)
      }
    }
    return (): JSX.Element => (
      <button id={id} onClick={(evt): void => onClickHandler(evt)}>
        {slots.text && slots.text()}
      </button>
    )
  }
})
