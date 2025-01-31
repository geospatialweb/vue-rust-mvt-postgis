import { Container } from 'typedi'

import { IAppState } from '@/interfaces'
import { AppService } from '@/services'
import { testData } from '@/test'

describe('AppService test suite', (): void => {
  const appService = Container.get(AppService)

  test('appState getter should be called with a return', (): void => {
    const { appState } = testData as { appState: IAppState },
      spy = vi.spyOn(appService, 'appState', 'get').mockReturnValue(appState)
    appService.appState
    expect(spy).toBeCalled()
    expect(spy).toHaveReturned()
  })

  test('setAppState method should be called', (): void => {
    const spy = vi.spyOn(appService, 'setAppState')
    appService.setAppState()
    expect(spy).toBeCalled()
  })

  test('setInitialZoom method should be called', (): void => {
    const spy = vi.spyOn(appService, 'setInitialZoom')
    appService.setInitialZoom()
    expect(spy).toBeCalled()
  })
})
