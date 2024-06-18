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

  test('setMapboxStyleState method should be called', (): void => {
    const spy = vi.spyOn(mapboxStyleService, 'setMapboxStyleState')
    mapboxStyleService.setMapboxStyleState()
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveReturnedTimes(1)
  })
})
