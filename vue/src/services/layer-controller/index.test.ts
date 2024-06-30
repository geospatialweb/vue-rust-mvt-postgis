import { createPinia, setActivePinia } from 'pinia'
import { Container } from 'typedi'

import { layerControllerLayers } from '@/configuration'
import { ILayerControllerState } from '@/interfaces'
import { LayerControllerService } from '@/services'
import { mockMapImplementation } from '@/test'

describe('LayerControllerService test suite', (): void => {
  const ids = layerControllerLayers.map((layer: ILayerControllerState): string => <string>Object.values(layer)[0])
  let layerControllerService: LayerControllerService

  beforeAll((): void => {
    setActivePinia(createPinia())
    layerControllerService = Container.get(LayerControllerService)
  })

  test('layerControllerState getter should be called', (): void => {
    const spy = vi.spyOn(layerControllerService, 'layerControllerState', 'get')
    layerControllerService.layerControllerState
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveReturnedTimes(1)
  })

  test.each(ids)("pass '%s' id to displayLayer method", (id): void => {
    const spy = vi.spyOn(layerControllerService, 'displayLayer').mockImplementation(mockMapImplementation)
    layerControllerService.displayLayer(id)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(id)
    expect(spy).toHaveReturnedTimes(1)
  })
})
