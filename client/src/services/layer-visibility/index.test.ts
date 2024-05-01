import { createPinia, setActivePinia } from 'pinia'
import { Container } from 'typedi'

import { LayerId } from '@/enums'
import { LayerVisibilityService } from '@/services'

describe('LayerVisibilityService test suite', (): void => {
  setActivePinia(createPinia())

  test('setLayerVisibilityState method should be called', (): void => {
    const bioshpereLayer: string = LayerId.BIOSPHERE,
      layerVisibilityService = Container.get(LayerVisibilityService),
      spy = vi.spyOn(layerVisibilityService, 'setLayerVisibilityState')
    layerVisibilityService.setLayerVisibilityState(bioshpereLayer)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(bioshpereLayer)
    expect(spy).toHaveReturnedTimes(1)
  })
})
