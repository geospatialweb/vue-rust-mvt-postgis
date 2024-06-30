import { Container } from 'typedi'

import { VectorLayerService } from '@/services'

describe('VectorLayerService test suite', (): void => {
  test('vectorLayers getter should be called', (): void => {
    const vectorLayerService = Container.get(VectorLayerService),
      spy = vi.spyOn(vectorLayerService, 'vectorLayers', 'get')
    vectorLayerService.vectorLayers
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveReturnedTimes(1)
  })
})
