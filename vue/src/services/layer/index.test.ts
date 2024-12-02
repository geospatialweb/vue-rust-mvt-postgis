import { Container } from 'typedi'

import { LayerService } from '@/services'

describe('LayerService test suite', (): void => {
  test('layers getter should be called', (): void => {
    const layerService = Container.get(LayerService),
      spy = vi.spyOn(layerService, 'layers', 'get')
    layerService.layers
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveReturnedTimes(1)
  })
})
