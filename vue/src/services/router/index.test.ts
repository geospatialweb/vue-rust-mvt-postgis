import { createPinia, setActivePinia } from 'pinia'
import { Container } from 'typedi'

import { layers } from '@/configuration'
import { RouterService } from '@/services'

describe('RouterService test suite', (): void => {
  setActivePinia(createPinia())

  test('setRoute method should be called', async (): Promise<void> => {
    const { id } = layers[5],
      routerService = Container.get(RouterService),
      spy = vi.spyOn(routerService, 'setRoute')
    await routerService.setRoute(id)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(id)
    expect(spy).toHaveReturnedTimes(1)
  })
})
