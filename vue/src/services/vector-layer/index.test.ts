import { Container } from 'typedi'

import { vectorLayers } from '@/configuration'
import { VectorLayerService } from '@/services'

import type { LayerSpecification } from 'mapbox-gl'

describe('VectorLayerService test suite', (): void => {
  test('vectorLayers getter should be called with a return', (): void => {
    const layers: LayerSpecification[] = <[]>[...vectorLayers],
      vectorLayerService = Container.get(VectorLayerService),
      spy = vi.spyOn(vectorLayerService, 'vectorLayers', 'get').mockReturnValue(layers)
    vectorLayerService.vectorLayers
    expect(spy).toBeCalled()
    expect(spy).toHaveReturned()
  })
})
