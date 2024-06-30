import { createPinia, setActivePinia } from 'pinia'
import { Container } from 'typedi'

import { MapboxStyleService } from '@/services'

describe('MapboxStyleService test suite', (): void => {
  let mapboxStyleService: MapboxStyleService

  beforeAll((): void => {
    setActivePinia(createPinia())
    mapboxStyleService = Container.get(MapboxStyleService)
  })

  test('activeMapboxStyle getter should be called', (): void => {
    const spy = vi.spyOn(mapboxStyleService, 'activeMapboxStyle', 'get')
    mapboxStyleService.activeMapboxStyle
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveReturnedTimes(1)
  })

  test('mapboxStylesState getter should be called', (): void => {
    const spy = vi.spyOn(mapboxStyleService, 'mapboxStylesState', 'get')
    mapboxStyleService.mapboxStylesState
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveReturnedTimes(1)
  })

  test('setActiveMapboxStyle method should be called', (): void => {
    const spy = vi.spyOn(mapboxStyleService, 'setActiveMapboxStyle')
    mapboxStyleService.setActiveMapboxStyle()
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveReturnedTimes(1)
  })

  test('setMapboxStyleState method should be called', (): void => {
    const spy = vi.spyOn(mapboxStyleService, 'setMapboxStyleState')
    mapboxStyleService.setMapboxStyleState()
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveReturnedTimes(1)
  })
})
