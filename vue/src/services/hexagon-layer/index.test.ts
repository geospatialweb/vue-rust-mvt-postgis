import { Container } from 'typedi'

import { hexagonLayerControllerSliders } from '@/configuration'
import { IHexagonLayerControllerSlider } from '@/interfaces'
import { HexagonLayerService } from '@/services'
import { mockDeckImplementation } from '@/test'

describe('HexagonLayerService test suite', (): void => {
  const hexagonLayerService = Container.get(HexagonLayerService)

  test('hexagonLayerState getter should be called', (): void => {
    const spy = vi.spyOn(hexagonLayerService, 'hexagonLayerState', 'get')
    hexagonLayerService.hexagonLayerState
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveReturnedTimes(1)
  })

  test('renderHexagonLayer method should be called', (): void => {
    const spy = vi.spyOn(hexagonLayerService, 'renderHexagonLayer').mockImplementation(mockDeckImplementation)
    hexagonLayerService.renderHexagonLayer()
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveReturnedTimes(1)
  })

  test('resetHexagonLayerState method should be called', (): void => {
    const spy = vi.spyOn(hexagonLayerService, 'resetHexagonLayerState').mockImplementation(mockDeckImplementation)
    hexagonLayerService.resetHexagonLayerState()
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveReturnedTimes(1)
  })

  test('setHexagonLayerState method should be called', (): void => {
    const sliders: IHexagonLayerControllerSlider[] = hexagonLayerControllerSliders,
      { id, min: value } = sliders[0],
      spy = vi.spyOn(hexagonLayerService, 'setHexagonLayerState').mockImplementation(mockDeckImplementation)
    hexagonLayerService.setHexagonLayerState({ id, value })
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith({ id, value })
    expect(spy).toHaveReturnedTimes(1)
  })
})
