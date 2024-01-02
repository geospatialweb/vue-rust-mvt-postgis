import 'vue/jsx'
import { Container } from 'typedi'
import { defineComponent } from 'vue'

import { hexagonUIButtons as buttons } from '@/configuration'
import { HexagonLayerService, RouterService } from '@/services'

export default defineComponent({
  name: 'HexagonUIButtons',
  props: {
    id: {
      type: String,
      required: true
    }
  },
  setup({ id }, { slots }) {
    const hexagonLayerService = Container.get(HexagonLayerService),
      routerService = Container.get(RouterService),
      resetHexagonLayer = (): void => {
        hexagonLayerService.resetHexagonLayerPropsState()
        hexagonLayerService.renderHexagonLayer()
      },
      setRoute = (name: string): void => void routerService.setRoute(name),
      onClickHandler = (evt: MouseEvent): void => {
        evt.stopPropagation()
        const { id } = evt.target as HTMLButtonElement
        if (id === buttons[0].id) return resetHexagonLayer()
        setRoute(id)
      }
    return (): JSX.Element => (
      <button id={id} onClick={(evt): void => onClickHandler(evt)}>
        {slots.text && slots.text()}
      </button>
    )
  }
})
