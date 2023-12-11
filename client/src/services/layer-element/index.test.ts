import { createPinia, setActivePinia } from 'pinia'
import { Container } from 'typedi'

import { layerElements } from '@/configuration'
import { LayerId } from '@/enums'
import { ILayerElement } from '@/interfaces'
import { LayerElementService } from '@/services'
import { mockMapImplementation } from '@/test'

describe('LayerElementService test suite', (): void => {
  const ids = layerElements.map((layer: ILayerElement): string => <string>Object.values(layer)[0])

  setActivePinia(createPinia())

  test.each(ids)("pass '%s' id to displayLayerElement method", (id): void => {
    const layerElementService = Container.get(LayerElementService),
      spy = vi.spyOn(layerElementService, 'displayLayerElement').mockImplementation(mockMapImplementation)
    layerElementService.displayLayerElement(<LayerId>id)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(<LayerId>id)
    expect(spy).toHaveReturnedTimes(1)
  })
})
