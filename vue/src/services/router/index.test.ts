import { Container } from 'typedi'

import { layerControllerLayers } from '@/configuration'
import { RouterService } from '@/services'

describe('RouterService test suite', (): void => {
  test('setRoute method should be called', async (): Promise<void> => {
    const { id } = layerControllerLayers[5],
      routerService = Container.get(RouterService),
      spy = vi.spyOn(routerService, 'setRoute')
    await routerService.setRoute(id)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(id)
    expect(spy).toHaveReturnedTimes(1)
  })
})
