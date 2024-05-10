import 'vue/jsx'
import { Container } from 'typedi'
import { defineComponent, PropType } from 'vue'

import { hexagonUISliders } from '@/configuration'
import {
  IHexagonLayerState,
  IHexagonLayerStateProp,
  IHexagonUILabelState,
  IHexagonUISlider,
  IHexagonUISliderProp
} from '@/interfaces'
import { HexagonLayerService, HexagonUIService } from '@/services'
import styles from '../index.module.css'

export default defineComponent({
  name: 'HexagonUISliders Component',
  props: {
    labelState: {
      type: Object as PropType<IHexagonUILabelState>,
      required: true
    },
    layerState: {
      type: Object as PropType<IHexagonLayerState>,
      required: true
    }
  },
  setup(props: IHexagonUISliderProp) {
    const { mouseover, mouseout } = styles,
      sliders: IHexagonUISlider[] = hexagonUISliders,
      renderHexagonLayer = ({ id, value }: IHexagonLayerStateProp): void => {
        const hexagonLayerService = Container.get(HexagonLayerService)
        hexagonLayerService.setHexagonLayerState({ id, value })
        hexagonLayerService.renderHexagonLayer()
      },
      setHexagonUILabelState = (id: string): void => {
        const hexagonUIService = Container.get(HexagonUIService)
        hexagonUIService.setHexagonUILabelState(id)
      },
      onInputHandler = (evt: Event): void => {
        evt.stopPropagation()
        const { id, value } = evt.target as HTMLInputElement
        renderHexagonLayer({ id, value })
      },
      onMouseover_onMouseoutHandler = (evt: MouseEvent): void => {
        evt.stopPropagation()
        const { id } = evt.target as HTMLInputElement
        setHexagonUILabelState(id)
      },
      jsx = ({ labelState, layerState }: IHexagonUISliderProp): JSX.Element => (
        <div>
          <hr />
          {Object.values(layerState).map((value: string, idx: number) => (
            <>
              <label
                class={labelState[sliders[idx].id as keyof IHexagonUILabelState] ? mouseover : mouseout}
                data-testid={sliders[idx].id}
              >
                <span>{sliders[idx].text}</span>
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
        </div>
      )
    return (): JSX.Element => jsx(props)
  }
})
