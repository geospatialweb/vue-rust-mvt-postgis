import { Container } from 'typedi'

import { HexagonLayerDataService } from '@/services'

describe('HexagonLayerDataService test suite', (): void => {
  test('hexagonLayerData getter should be called', (): void => {
    const hexagonLayerDataService = Container.get(HexagonLayerDataService),
      spy = vi.spyOn(hexagonLayerDataService, 'hexagonLayerData', 'get')
    hexagonLayerDataService.hexagonLayerData
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveReturnedTimes(1)
  })
})
