import 'vue/jsx'
import { Container } from 'typedi'
import { defineComponent } from 'vue'

import { HexagonUIButtons, HexagonUIHeading, HexagonUISliders } from '@/components'
import { hexagonUIButtons as buttons, hexagonUIHeading } from '@/configuration'
import { IHexagonLayerProp, IHexagonUILabelElement, ISlot } from '@/interfaces'
import { HexagonLayerService, HexagonUIService } from '@/services'
import styles from './index.module.css'

export default defineComponent({
  name: 'HexagonUI',
  setup() {
    /* prettier-ignore */
    const { hexagonui } = styles,
      { heading } = hexagonUIHeading,
      getHexagonLayerPropsState = (): IHexagonLayerProp => {
        const hexagonLayerService = Container.get(HexagonLayerService),
          { hexagonLayerPropsState } = hexagonLayerService
        return hexagonLayerPropsState
      },
      getHexagonUILabelElementState = (): IHexagonUILabelElement => {
        const hexagonUIService = Container.get(HexagonUIService),
          { hexagonUILabelElementState } = hexagonUIService
        return hexagonUILabelElementState
      },
      setButtonSlot = (slot: ISlot): JSX.Element => (
        <HexagonUIButtons id={slot.id}>{{ text: (): string => slot.text }}</HexagonUIButtons>
      ),
      jsx = (props: IHexagonLayerProp, label: IHexagonUILabelElement): JSX.Element => (
        <div class={hexagonui} role="presentation">
          <HexagonUIHeading>{{ heading: (): string => heading }}</HexagonUIHeading>
          <HexagonUISliders label={label} props={props} />
          {buttons.map(setButtonSlot)}
        </div>
      )
    return (): JSX.Element => jsx(getHexagonLayerPropsState(), getHexagonUILabelElementState())
  }
})
