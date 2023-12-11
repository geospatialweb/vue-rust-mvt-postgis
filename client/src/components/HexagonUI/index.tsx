import { Container } from 'typedi'
import { computed, ComputedRef, defineComponent } from 'vue'

import { HexagonUIButtons, HexagonUIHeading, HexagonUISliders } from '@/components'
import { hexagonUIButtons as buttons, hexagonUIHeading } from '@/configuration'
import { IHexagonLayerProp, IHexagonUILabelElement } from '@/interfaces'
import { HexagonLayerService, HexagonUIService } from '@/services'
import styles from './index.module.css'

export default defineComponent({
  name: 'HexagonUI',
  setup() {
    /* prettier-ignore */
    const { hexagonui } = styles, { heading } = hexagonUIHeading,
      hexagonLayerService = Container.get(HexagonLayerService),
      hexagonUIService = Container.get(HexagonUIService),
      getHexagonLayerPropsState = (): ComputedRef<IHexagonLayerProp> => {
        const { hexagonLayerPropsState } = hexagonLayerService
        return computed((): IHexagonLayerProp => hexagonLayerPropsState)
      },
      getHexagonUILabelElementState = (): ComputedRef<IHexagonUILabelElement> => {
        const { hexagonUILabelElementState } = hexagonUIService
        return computed((): IHexagonUILabelElement => hexagonUILabelElementState)
      },
      jsx = (props: IHexagonLayerProp, label: IHexagonUILabelElement): JSX.Element => (
        <div class={hexagonui} role="presentation">
          <HexagonUIHeading>{{ heading: (): string => heading }}</HexagonUIHeading>
          <HexagonUISliders label={label} props={props} />
          {buttons.map(
            ({ id, text }): JSX.Element => (
              <HexagonUIButtons id={id}>{{ text: (): string => text }}</HexagonUIButtons>
            )
          )}
        </div>
      )
    return (): JSX.Element => jsx(getHexagonLayerPropsState().value, getHexagonUILabelElementState().value)
  }
})
