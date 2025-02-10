import { Container } from 'typedi'

import { hexagonLayerControllerSliders } from '@/configuration'
import { HexagonLayerService } from '@/services'
import { mockDeckImplementation, testData } from '@/test'

import type { IHexagonLayerControllerSlider, IHexagonLayerState } from '@/interfaces'

describe('HexagonLayerService test suite', (): void => {
  const hexagonLayerService = Container.get(HexagonLayerService)

  test('hexagonLayerState getter should be called with a return', (): void => {
    const { hexagonLayerState } = testData as { hexagonLayerState: IHexagonLayerState },
      spy = vi.spyOn(hexagonLayerService, 'hexagonLayerState', 'get').mockReturnValue(hexagonLayerState)
    hexagonLayerService.hexagonLayerState
    expect(spy).toBeCalled()
    expect(spy).toHaveReturned()
  })

  test('renderHexagonLayer method should be called', async (): Promise<void> => {
    const spy = vi.spyOn(hexagonLayerService, 'renderHexagonLayer').mockImplementation(mockDeckImplementation)
    await hexagonLayerService.renderHexagonLayer()
    expect(spy).toBeCalled()
  })

  test('resetHexagonLayerState method should be called', async (): Promise<void> => {
    const spy = vi.spyOn(hexagonLayerService, 'resetHexagonLayerState').mockImplementation(mockDeckImplementation)
    await hexagonLayerService.resetHexagonLayerState()
    expect(spy).toBeCalled()
  })

  test('setHexagonLayerState method should be called', (): void => {
    const sliders: IHexagonLayerControllerSlider[] = hexagonLayerControllerSliders,
      { id, min: value } = sliders[0],
      spy = vi.spyOn(hexagonLayerService, 'setHexagonLayerState').mockImplementation(mockDeckImplementation)
    hexagonLayerService.setHexagonLayerState({ id, value })
    expect(spy).toBeCalled()
    expect(spy).toBeCalledWith({ id, value })
  })
})
