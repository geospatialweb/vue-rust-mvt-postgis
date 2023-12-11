import { createPinia, setActivePinia } from 'pinia'
import { Container } from 'typedi'

import { hexagonUISliders as sliders } from '@/configuration'
import { HexagonLayerService } from '@/services'
import { mockDeckImplementation } from '@/test'

describe('HexagonLayerService test suite', (): void => {
  let hexagonLayerService: HexagonLayerService

  beforeEach((): void => {
    setActivePinia(createPinia())
    hexagonLayerService = Container.get(HexagonLayerService)
  })

  test('renderHexagonLayer method should be called', (): void => {
    const spy = vi.spyOn(hexagonLayerService, 'renderHexagonLayer').mockImplementation(mockDeckImplementation)
    hexagonLayerService.renderHexagonLayer()
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveReturnedTimes(1)
  })

  test('resetHexagonLayerPropsState method should be called', (): void => {
    const spy = vi.spyOn(hexagonLayerService, 'resetHexagonLayerPropsState').mockImplementation(mockDeckImplementation)
    hexagonLayerService.resetHexagonLayerPropsState()
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveReturnedTimes(1)
  })

  test('setHexagonLayerPropsState method should be called', (): void => {
    const { id, min: value } = sliders[0],
      spy = vi.spyOn(hexagonLayerService, 'setHexagonLayerPropsState').mockImplementation(mockDeckImplementation)
    hexagonLayerService.setHexagonLayerPropsState({ id, value })
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith({ id, value })
    expect(spy).toHaveReturnedTimes(1)
  })
})
