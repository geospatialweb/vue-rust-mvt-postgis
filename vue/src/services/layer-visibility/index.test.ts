import { Container } from 'typedi'

import { Layer } from '@/enums'
import { ILayerVisibilityState } from '@/interfaces'
import { LayerVisibilityService } from '@/services'
import { testData } from '@/test'

describe('LayerVisibilityService test suite', (): void => {
  const layerVisibilityService = Container.get(LayerVisibilityService)

  test('layerVisibilityState getter should be called with a return', (): void => {
    const { layerVisibility } = testData as { layerVisibility: ILayerVisibilityState },
      spy = vi.spyOn(layerVisibilityService, 'layerVisibilityState', 'get').mockReturnValue(layerVisibility)
    layerVisibilityService.layerVisibilityState
    expect(spy).toBeCalled()
    expect(spy).toHaveReturned()
  })

  test('setLayerVisibilityState method should be called', (): void => {
    const spy = vi.spyOn(layerVisibilityService, 'setLayerVisibilityState')
    layerVisibilityService.setLayerVisibilityState(Layer.Biosphere)
    expect(spy).toBeCalled()
    expect(spy).toBeCalledWith(Layer.Biosphere)
  })
})
