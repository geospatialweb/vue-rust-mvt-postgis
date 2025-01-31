import { Container } from 'typedi'

import { HexagonLayerDataService } from '@/services'

describe('HexagonLayerDataService test suite', (): void => {
  test('getHexagonLayerData method should be called with a return', async (): Promise<void> => {
    const hexagonLayerDataService = Container.get(HexagonLayerDataService),
      spy = vi.spyOn(hexagonLayerDataService, 'getHexagonLayerData')
    await hexagonLayerDataService.getHexagonLayerData()
    expect(spy).toBeCalled()
    expect(spy).toHaveReturned()
  })
})
