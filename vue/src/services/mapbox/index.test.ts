import { Container } from 'typedi'

import { Layer } from '@/enums'
import { ITrail } from '@/interfaces'
import { MapboxService } from '@/services'
import { mockMapImplementation, testData } from '@/test'

describe('MapboxService test suite', (): void => {
  const mapboxService = Container.get(MapboxService)

  test('map getter should be called with a return', (): void => {
    const spy = vi.spyOn(mapboxService, 'map', 'get')
    mapboxService.map
    expect(spy).toBeCalled()
    expect(spy).toHaveReturned()
  })

  test('loadMap method should be called', (): void => {
    const spy = vi.spyOn(mapboxService, 'loadMap').mockImplementation(mockMapImplementation)
    mapboxService.loadMap()
    expect(spy).toBeCalled()
  })

  test('mapFlyTo method should be called', (): void => {
    const { trailParams } = testData,
      spy = vi.spyOn(mapboxService, 'mapFlyTo').mockImplementation(mockMapImplementation)
    mapboxService.mapFlyTo(<ITrail>trailParams)
    expect(spy).toBeCalled()
    expect(spy).toBeCalledWith(<ITrail>trailParams)
  })

  test('removeMapResources method should be called', (): void => {
    const spy = vi.spyOn(mapboxService, 'removeMapResources').mockImplementation(mockMapImplementation)
    mapboxService.removeMapResources()
    expect(spy).toBeCalled()
  })

  test('resetMap method should be called', (): void => {
    const spy = vi.spyOn(mapboxService, 'resetMap').mockImplementation(mockMapImplementation)
    mapboxService.resetMap()
    expect(spy).toBeCalled()
  })

  test('setInitialMapZoomState method should be called', (): void => {
    const { initialZoom } = testData,
      spy = vi.spyOn(mapboxService, 'setInitialMapZoomState').mockImplementation(mockMapImplementation)
    mapboxService.setInitialMapZoomState(initialZoom)
    expect(spy).toBeCalled()
    expect(spy).toBeCalledWith(initialZoom)
  })

  test('setLayerVisibility method should be called', (): void => {
    const spy = vi.spyOn(mapboxService, 'setLayerVisibility').mockImplementation(mockMapImplementation)
    mapboxService.setLayerVisibility(Layer.Biosphere)
    expect(spy).toBeCalled()
    expect(spy).toBeCalledWith(Layer.Biosphere)
  })
})
