import { createPinia, setActivePinia } from 'pinia'
import { Container } from 'typedi'

import { AppService } from '@/services'

describe('AppService test suite', (): void => {
  setActivePinia(createPinia())

  test('setInitialZoom method should be called', (): void => {
    const appService = Container.get(AppService),
      spy = vi.spyOn(appService, 'setInitialZoom')
    appService.setInitialZoom()
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveReturnedTimes(1)
  })
})
