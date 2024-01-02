import { createPinia, setActivePinia } from 'pinia'
import { Container } from 'typedi'

import { LayerId } from '@/enums'
import { ITrail } from '@/interfaces'
import { MapboxService } from '@/services'
import { mockMapImplementation, testData } from '@/test'

describe('MapboxService test suite', (): void => {
  let mapboxService: MapboxService

  beforeEach((): void => {
    setActivePinia(createPinia())
    mapboxService = Container.get(MapboxService)
  })

  test('loadMap method should be called', (): void => {
    const spy = vi.spyOn(mapboxService, 'loadMap').mockImplementation(mockMapImplementation)
    mapboxService.loadMap()
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveReturnedTimes(1)
  })

  test('mapFlyTo method should be called', (): void => {
    const { trailParams } = testData,
      spy = vi.spyOn(mapboxService, 'mapFlyTo').mockImplementation(mockMapImplementation)
    mapboxService.mapFlyTo(<ITrail>trailParams)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveReturnedTimes(1)
  })

  test('removeMapResources method should be called', (): void => {
    const spy = vi.spyOn(mapboxService, 'removeMapResources').mockImplementation(mockMapImplementation)
    mapboxService.removeMapResources()
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveReturnedTimes(1)
  })

  test('resetMap method should be called', (): void => {
    const spy = vi.spyOn(mapboxService, 'resetMap').mockImplementation(mockMapImplementation)
    mapboxService.resetMap()
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveReturnedTimes(1)
  })

  test('setInitialZoomState method should be called', (): void => {
    const { initialZoom } = testData,
      spy = vi.spyOn(mapboxService, 'setInitialZoomState').mockImplementation(mockMapImplementation)
    mapboxService.setInitialZoomState(initialZoom)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(initialZoom)
    expect(spy).toHaveReturnedTimes(1)
  })

  test('setLayerVisibility method should be called', (): void => {
    const spy = vi.spyOn(mapboxService, 'setLayerVisibility').mockImplementation(mockMapImplementation)
    mapboxService.setLayerVisibility(LayerId.BIOSPHERE)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(LayerId.BIOSPHERE)
    expect(spy).toHaveReturnedTimes(1)
  })
})
