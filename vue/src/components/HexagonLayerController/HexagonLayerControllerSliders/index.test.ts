import { mount } from '@vue/test-utils'

import { HexagonLayerControllerSliders } from '@/components'
import { testData } from '@/test'

describe('HexagonLayerControllerSliders component test suite', (): void => {
  it('should receive correct props', (): void => {
    const { hexagonLayerControllerSliderLabelsState, hexagonLayerState } = testData,
      wrapper = mount(HexagonLayerControllerSliders, {
        props: {
          layerState: hexagonLayerState,
          sliderLabelsState: hexagonLayerControllerSliderLabelsState
        }
      })
    expect(wrapper.props().layerState).toEqual(hexagonLayerState)
    expect(wrapper.props().sliderLabelsState).toEqual(hexagonLayerControllerSliderLabelsState)
  })
})
