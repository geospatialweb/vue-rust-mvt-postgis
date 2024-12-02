import { Container } from 'typedi'

import { Layer } from '@/enums'
import { ITrail } from '@/interfaces'
import { MapboxService } from '@/services'
import { mockMapImplementation, testData } from '@/test'

describe('MapboxService test suite', (): void => {
  const mapboxService = Container.get(MapboxService)

  test('map getter should be called', (): void => {
    const spy = vi.spyOn(mapboxService, 'map', 'get')
    mapboxService.map
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveReturnedTimes(1)
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
    mapboxService.setLayerVisibility(Layer.Biosphere)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(Layer.Biosphere)
    expect(spy).toHaveReturnedTimes(1)
  })
})
