import { Container } from 'typedi'

import { Layer } from '@/enums'
import { LayerVisibilityService } from '@/services'

describe('LayerVisibilityService test suite', (): void => {
  const layerVisibilityService = Container.get(LayerVisibilityService)

  test('layerVisibilityState getter should be called', (): void => {
    const spy = vi.spyOn(layerVisibilityService, 'layerVisibilityState', 'get')
    layerVisibilityService.layerVisibilityState
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveReturnedTimes(1)
  })

  test('setLayerVisibilityState method should be called', (): void => {
    const spy = vi.spyOn(layerVisibilityService, 'setLayerVisibilityState')
    layerVisibilityService.setLayerVisibilityState(Layer.Biosphere)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(Layer.Biosphere)
    expect(spy).toHaveReturnedTimes(1)
  })
})
