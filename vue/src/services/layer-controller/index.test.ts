import { createPinia, setActivePinia } from 'pinia'
import { Container } from 'typedi'

import { layers } from '@/configuration'
import { ILayerControllerState } from '@/interfaces'
import { LayerControllerService } from '@/services'
import { mockMapImplementation } from '@/test'

describe('LayerControllerService test suite', (): void => {
  const ids = layers.map((layer: ILayerControllerState): string => <string>Object.values(layer)[0])

  setActivePinia(createPinia())

  test.each(ids)("pass '%s' id to displayLayer method", (id): void => {
    const layerControllerService = Container.get(LayerControllerService),
      spy = vi.spyOn(layerControllerService, 'displayLayer').mockImplementation(mockMapImplementation)
    layerControllerService.displayLayer(id)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(id)
    expect(spy).toHaveReturnedTimes(1)
  })
})
