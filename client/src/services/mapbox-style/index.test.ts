import { createPinia, setActivePinia } from 'pinia'
import { Container } from 'typedi'

import { MapboxStyleService } from '@/services'

describe('MapboxStyleService test suite', (): void => {
  let mapboxStyleService: MapboxStyleService

  beforeEach((): void => {
    setActivePinia(createPinia())
    mapboxStyleService = Container.get(MapboxStyleService)
  })

  test('setActiveMapboxStyle method should be called', (): void => {
    const spy = vi.spyOn(mapboxStyleService, 'setActiveMapboxStyle')
    mapboxStyleService.setActiveMapboxStyle()
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveReturnedTimes(1)
  })

  test('setMapboxStylesState method should be called', (): void => {
    const spy = vi.spyOn(mapboxStyleService, 'setMapboxStylesState')
    mapboxStyleService.setMapboxStylesState()
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveReturnedTimes(1)
  })
})
