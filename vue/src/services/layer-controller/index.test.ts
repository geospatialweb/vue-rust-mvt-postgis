import { Container } from 'typedi'

import { layerControllerLayers } from '@/configuration'
import { ILayerControllerState } from '@/interfaces'
import { LayerControllerService } from '@/services'
import { mockMapImplementation } from '@/test'

describe('LayerControllerService test suite', (): void => {
  const ids = layerControllerLayers.map((layer: ILayerControllerState): string => <string>Object.values(layer)[0]),
    layerControllerService = Container.get(LayerControllerService)

  test('layerControllerState getter should be called with a return', (): void => {
    const spy = vi.spyOn(layerControllerService, 'layerControllerState', 'get').mockReturnValue(layerControllerLayers)
    layerControllerService.layerControllerState
    expect(spy).toBeCalled()
    expect(spy).toHaveReturned()
  })

  test.each(ids)("pass '%s' id to displayLayer method", (id): void => {
    const spy = vi.spyOn(layerControllerService, 'displayLayer').mockImplementation(mockMapImplementation)
    layerControllerService.displayLayer(id)
    expect(spy).toBeCalled()
    expect(spy).toBeCalledWith(id)
  })
})
