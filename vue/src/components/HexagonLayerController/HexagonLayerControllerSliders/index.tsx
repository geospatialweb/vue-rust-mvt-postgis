import 'vue/jsx'
import { Container } from 'typedi'
import { defineComponent, PropType } from 'vue'

import { hexagonLayerControllerSliders } from '@/configuration'
import { HexagonLayerService, HexagonLayerControllerService } from '@/services'
import styles from '../index.module.css'

import type {
  IHexagonLayerControllerSlider,
  IHexagonLayerControllerSliderLabelsState,
  IHexagonLayerState
} from '@/interfaces'

export default defineComponent({
  name: 'HexagonLayerControllerSliders Component',
  props: {
    layerState: {
      type: Object as PropType<IHexagonLayerState>,
      required: true
    },
    sliderLabelsState: {
      type: Object as PropType<IHexagonLayerControllerSliderLabelsState>,
      required: true
    }
  },
  setup({ layerState, sliderLabelsState }) {
    const { mouseover, mouseout } = styles,
      sliders: IHexagonLayerControllerSlider[] = hexagonLayerControllerSliders,
      onInputHandler = (evt: Event): void => {
        evt.stopPropagation()
        const { id, value } = evt.target as HTMLInputElement,
          { renderHexagonLayer, setHexagonLayerState } = Container.get(HexagonLayerService)
        setHexagonLayerState({ id, value })
        void renderHexagonLayer()
      },
      onMouseover_onMouseoutHandler = (evt: MouseEvent): void => {
        evt.stopPropagation()
        const { id } = evt.target as HTMLInputElement,
          { setSliderLabelsState } = Container.get(HexagonLayerControllerService)
        setSliderLabelsState(id)
      }
    return (): JSX.Element => (
      <div>
        <hr />
        {Object.values(layerState).map((value: string, idx: number) => (
          <div>
            <label
              class={
                sliderLabelsState[sliders[idx].id as keyof IHexagonLayerControllerSliderLabelsState]
                  ? mouseover
                  : mouseout
              }
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
          </div>
        ))}
      </div>
    )
  }
})
