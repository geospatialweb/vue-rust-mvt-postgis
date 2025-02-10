import { Container } from 'typedi'

import { hexagonLayerControllerSliders } from '@/configuration'
import { HexagonLayerControllerService } from '@/services'
import { testData } from '@/test'

import type { IHexagonLayerControllerSlider, IHexagonLayerControllerSliderLabelsState } from '@/interfaces'

describe('HexagonLayerControllerService test suite', (): void => {
  const hexagonLayerControllerService = Container.get(HexagonLayerControllerService)

  test('sliderLabelsState getter should be called with a return', (): void => {
    const { sliderLabelsState } = testData as { sliderLabelsState: IHexagonLayerControllerSliderLabelsState },
      spy = vi.spyOn(hexagonLayerControllerService, 'sliderLabelsState', 'get').mockReturnValue(sliderLabelsState)
    hexagonLayerControllerService.sliderLabelsState
    expect(spy).toBeCalled()
    expect(spy).toHaveReturned()
  })

  test('setSliderLabelsState method should be called', (): void => {
    const [slider]: IHexagonLayerControllerSlider[] = hexagonLayerControllerSliders,
      spy = vi.spyOn(hexagonLayerControllerService, 'setSliderLabelsState')
    hexagonLayerControllerService.setSliderLabelsState(slider.id)
    expect(spy).toBeCalled()
    expect(spy).toBeCalledWith(slider.id)
  })
})
