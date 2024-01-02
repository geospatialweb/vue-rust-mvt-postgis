import { createPinia, setActivePinia } from 'pinia'
import { Container } from 'typedi'

import { LayerId } from '@/enums'
import { LayerVisibilityService } from '@/services'

describe('LayerVisibilityService test suite', (): void => {
  setActivePinia(createPinia())

  test('setLayerVisibilityState method should be called', (): void => {
    const layerVisibilityService = Container.get(LayerVisibilityService),
      spy = vi.spyOn(layerVisibilityService, 'setLayerVisibilityState')
    layerVisibilityService.setLayerVisibilityState(LayerId.BIOSPHERE)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(LayerId.BIOSPHERE)
    expect(spy).toHaveReturnedTimes(1)
  })
})
