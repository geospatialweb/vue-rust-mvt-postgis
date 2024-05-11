import 'vue/jsx'
import { Container } from 'typedi'
import { defineComponent } from 'vue'

import { HexagonUIButtons, HexagonUIHeading, HexagonUISliders } from '@/components'
import { hexagonUIButtons, hexagonUIHeading } from '@/configuration'
import { IHexagonLayerState, IHexagonUIButton, IHexagonUILabelState } from '@/interfaces'
import { HexagonLayerService, HexagonUIService } from '@/services'
import styles from './index.module.css'

export default defineComponent({
  name: 'HexagonUI Component',
  setup() {
    const { hexagon_ui } = styles,
      { heading } = hexagonUIHeading,
      buttons: IHexagonUIButton[] = hexagonUIButtons,
      getHexagonLayerState = (): IHexagonLayerState => {
        const { hexagonLayerState } = Container.get(HexagonLayerService)
        return hexagonLayerState
      },
      getHexagonUILabelState = (): IHexagonUILabelState => {
        const { hexagonUILabelState } = Container.get(HexagonUIService)
        return hexagonUILabelState
      },
      setButtonSlots = (button: IHexagonUIButton): JSX.Element => (
        <HexagonUIButtons id={button.id}>{{ text: (): string => button.text }}</HexagonUIButtons>
      ),
      jsx = (labelState: IHexagonUILabelState, layerState: IHexagonLayerState): JSX.Element => (
        <div class={hexagon_ui} role="presentation">
          <HexagonUIHeading>{{ heading: (): string => heading }}</HexagonUIHeading>
          <HexagonUISliders labelState={labelState} layerState={layerState} />
          {buttons.map(setButtonSlots)}
        </div>
      )
    return (): JSX.Element => jsx(getHexagonUILabelState(), getHexagonLayerState())
  }
})
