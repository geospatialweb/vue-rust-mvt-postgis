import { createPinia, setActivePinia } from 'pinia'
import { Container } from 'typedi'

import { AppService } from '@/services'

describe('AppService test suite', (): void => {
  let appService: AppService

  beforeAll((): void => {
    setActivePinia(createPinia())
    appService = Container.get(AppService)
  })

  test('appState getter should be called', (): void => {
    const spy = vi.spyOn(appService, 'appState', 'get')
    appService.appState
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveReturnedTimes(1)
  })

  test('setInitialZoom method should be called', (): void => {
    const spy = vi.spyOn(appService, 'setInitialZoom')
    appService.setInitialZoom()
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveReturnedTimes(1)
  })
})
