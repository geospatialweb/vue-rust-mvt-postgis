import 'vue/jsx'
import { Container } from 'typedi'
import { defineComponent } from 'vue'

import { hexagonUIButtons } from '@/configuration'
import { IHexagonUIButton } from '@/interfaces'
import { HexagonLayerService, RouterService } from '@/services'

export default defineComponent({
  name: 'HexagonUIButtons Component',
  props: {
    id: {
      type: String,
      required: true
    }
  },
  setup({ id }, { slots }) {
    const buttons: IHexagonUIButton[] = hexagonUIButtons,
      resetHexagonLayer = (): void => {
        const hexagonLayerService = Container.get(HexagonLayerService)
        hexagonLayerService.resetHexagonLayerState()
        hexagonLayerService.renderHexagonLayer()
      },
      setRoute = (route: string): void => {
        const routerService = Container.get(RouterService)
        void routerService.setRoute(route)
      },
      onClickHandler = (evt: MouseEvent): void => {
        evt.stopPropagation()
        const { id } = evt.target as HTMLButtonElement
        id === buttons[0].id ? resetHexagonLayer() : setRoute(id)
      }
    return (): JSX.Element => (
      <button id={id} onClick={(evt): void => onClickHandler(evt)}>
        {slots.text && slots.text()}
      </button>
    )
  }
})
