import 'vue/jsx'
import { Container } from 'typedi'
import { defineComponent, PropType } from 'vue'

import { hexagonUISliders as sliders } from '@/configuration'
import { IHexagonLayerProp, IHexagonLayerPropState, IHexagonUILabelElement, IHexagonUIProp } from '@/interfaces'
import { HexagonLayerService, HexagonUIService } from '@/services'
import styles from '../index.module.css'

export default defineComponent({
  name: 'HexagonUISliders Component',
  props: {
    label: {
      type: Object as PropType<IHexagonUILabelElement>,
      required: true
    },
    props: {
      type: Object as PropType<IHexagonLayerProp>,
      required: true
    }
  },
  setup(props: IHexagonUIProp) {
    const { mouseover, mouseout } = styles,
      hexagonLayerService = Container.get(HexagonLayerService),
      hexagonUIService = Container.get(HexagonUIService),
      renderHexagonLayer = ({ id, value }: IHexagonLayerPropState): void => {
        hexagonLayerService.setHexagonLayerPropsState({ id, value })
        hexagonLayerService.renderHexagonLayer()
      },
      setHexagonUILabelElementState = (id: string): void => hexagonUIService.setHexagonUILabelElementState(id),
      onInputHandler = (evt: Event): void => {
        evt.stopPropagation()
        const { id, value } = evt.target as HTMLInputElement
        renderHexagonLayer({ id, value })
      },
      onMouseover_onMouseoutHandler = (evt: MouseEvent): void => {
        evt.stopPropagation()
        const { id } = evt.target as HTMLInputElement
        setHexagonUILabelElementState(id)
      },
      jsx = ({ props, label }: IHexagonUIProp): JSX.Element => (
        <>
          <hr />
          {Object.values(props).map((value: string, idx: number) => (
            <>
              <label
                class={label[sliders[idx].id as keyof IHexagonUILabelElement] ? mouseover : mouseout}
                data-testid={sliders[idx].id}
              >
                {sliders[idx].text}
                <input
                  id={sliders[idx].id}
                  min={sliders[idx].min}
                  max={sliders[idx].max}
                  step={sliders[idx].step}
                  type="range"
                  value={value}
                  aria-valuemin={sliders[idx].min}
                  aria-valuemax={sliders[idx].max}
                  aria-valuenow={value}
                  onInput={(evt): void => onInputHandler(evt)}
                  onMouseover={(evt): void => onMouseover_onMouseoutHandler(evt)}
                  onMouseout={(evt): void => onMouseover_onMouseoutHandler(evt)}
                />
              </label>
              <output for={sliders[idx].id}>{value}</output>
              <hr />
            </>
          ))}
        </>
      )
    return (): JSX.Element => jsx(props)
  }
})
