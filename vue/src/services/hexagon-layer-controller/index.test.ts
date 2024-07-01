import { Container } from 'typedi'

import { hexagonLayerControllerSliders } from '@/configuration'
import { IHexagonLayerControllerSlider } from '@/interfaces'
import { HexagonLayerControllerService } from '@/services'

describe('HexagonLayerControllerService test suite', (): void => {
  test('setHexagonLayerControllerSliderLabel method should be called', (): void => {
    const [slider]: IHexagonLayerControllerSlider[] = hexagonLayerControllerSliders,
      id = slider.id,
      hexagonLayerControllerService = Container.get(HexagonLayerControllerService),
      spy = vi.spyOn(hexagonLayerControllerService, 'setHexagonLayerControllerSliderLabel')
    hexagonLayerControllerService.setHexagonLayerControllerSliderLabel(id)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(id)
    expect(spy).toHaveReturnedTimes(1)
  })
})
