import 'vue/jsx'
import { Container } from 'typedi'
import { defineComponent } from 'vue'

import {
  HexagonLayerControllerButtons,
  HexagonLayerControllerHeading,
  HexagonLayerControllerSliders
} from '@/components'
import { hexagonLayerControllerButtons, hexagonLayerControllerHeading } from '@/configuration'
import { HexagonLayerService, HexagonLayerControllerService } from '@/services'
import styles from './index.module.css'

import type {
  IHexagonLayerState,
  IHexagonLayerControllerButton,
  IHexagonLayerControllerSliderLabelsState
} from '@/interfaces'

export default defineComponent({
  name: 'HexagonLayerController Component',
  setup() {
    const { hexagon_layer_controller } = styles,
      { heading } = hexagonLayerControllerHeading,
      buttons: IHexagonLayerControllerButton[] = hexagonLayerControllerButtons,
      getHexagonLayerState = (): IHexagonLayerState => {
        const { hexagonLayerState } = Container.get(HexagonLayerService)
        return hexagonLayerState
      },
      getHexagonLayerControllerSliderLabelsState = (): IHexagonLayerControllerSliderLabelsState => {
        const { sliderLabelsState } = Container.get(HexagonLayerControllerService)
        return sliderLabelsState
      },
      setButtonSlots = ({ id, text }: IHexagonLayerControllerButton): JSX.Element => (
        <HexagonLayerControllerButtons id={id}>{{ text: (): string => text }}</HexagonLayerControllerButtons>
      ),
      jsx = (
        layerState: IHexagonLayerState,
        sliderLabelsState: IHexagonLayerControllerSliderLabelsState
      ): JSX.Element => (
        <div class={hexagon_layer_controller} role="presentation">
          <HexagonLayerControllerHeading>{{ heading: (): string => heading }}</HexagonLayerControllerHeading>
          <HexagonLayerControllerSliders layerState={layerState} sliderLabelsState={sliderLabelsState} />
          {buttons.map(setButtonSlots)}
        </div>
      )
    return (): JSX.Element => jsx(getHexagonLayerState(), getHexagonLayerControllerSliderLabelsState())
  }
})
