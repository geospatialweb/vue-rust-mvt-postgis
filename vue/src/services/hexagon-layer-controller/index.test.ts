import { Container } from 'typedi'

import { hexagonLayerControllerSliders } from '@/configuration'
import { IHexagonLayerControllerSlider } from '@/interfaces'
import { HexagonLayerControllerService } from '@/services'

describe('HexagonLayerControllerService test suite', (): void => {
  const hexagonLayerControllerService = Container.get(HexagonLayerControllerService)

  test('sliderLabelsState getter should be called', (): void => {
    const spy = vi.spyOn(hexagonLayerControllerService, 'sliderLabelsState', 'get')
    hexagonLayerControllerService.sliderLabelsState
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveReturnedTimes(1)
  })
  test('setHexagonLayerControllerSliderLabel method should be called', (): void => {
    const [slider]: IHexagonLayerControllerSlider[] = hexagonLayerControllerSliders,
      id = slider.id,
      spy = vi.spyOn(hexagonLayerControllerService, 'setHexagonLayerControllerSliderLabel')
    hexagonLayerControllerService.setHexagonLayerControllerSliderLabel(id)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(id)
    expect(spy).toHaveReturnedTimes(1)
  })
})
