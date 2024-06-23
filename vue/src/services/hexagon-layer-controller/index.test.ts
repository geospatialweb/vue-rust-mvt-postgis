import { createPinia, setActivePinia } from 'pinia'
import { Container } from 'typedi'

import { hexagonLayerControllerSliders } from '@/configuration'
import { IHexagonLayerControllerSlider } from '@/interfaces'
import { HexagonLayerControllerService } from '@/services'

describe('HexagonLayerControllerService test suite', (): void => {
  setActivePinia(createPinia())

  test('setHexagonLayerControllerSliderLabel method should be called', (): void => {
    const sliders: IHexagonLayerControllerSlider[] = hexagonLayerControllerSliders,
      id = sliders[0].id,
      hexagonLayerControllerService = Container.get(HexagonLayerControllerService),
      spy = vi.spyOn(hexagonLayerControllerService, 'setHexagonLayerControllerSliderLabel')
    hexagonLayerControllerService.setHexagonLayerControllerSliderLabel(id)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(id)
    expect(spy).toHaveReturnedTimes(1)
  })
})
