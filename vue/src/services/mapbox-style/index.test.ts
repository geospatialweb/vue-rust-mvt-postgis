import { Container } from 'typedi'

import { MapboxStyleService } from '@/services'
import { testData } from '@/test'

import type { IMapboxStylesState } from '@/interfaces'

describe('MapboxStyleService test suite', (): void => {
  const mapboxStyleService = Container.get(MapboxStyleService)

  test('activeMapboxStyle getter should be called with a return', (): void => {
    const { activeMapboxStyle } = testData,
      spy = vi.spyOn(mapboxStyleService, 'activeMapboxStyle', 'get').mockReturnValue(activeMapboxStyle)
    mapboxStyleService.activeMapboxStyle
    expect(spy).toBeCalled()
    expect(spy).toHaveReturned()
  })

  test('mapboxStylesState getter should be called with a return', (): void => {
    const { mapboxStyles } = testData as { mapboxStyles: IMapboxStylesState },
      spy = vi.spyOn(mapboxStyleService, 'mapboxStylesState', 'get').mockReturnValue(mapboxStyles)
    mapboxStyleService.mapboxStylesState
    expect(spy).toBeCalled()
    expect(spy).toHaveReturned()
  })

  test('setActiveMapboxStyle method should be called', (): void => {
    const spy = vi.spyOn(mapboxStyleService, 'setActiveMapboxStyle')
    mapboxStyleService.setActiveMapboxStyle()
    expect(spy).toBeCalled()
  })

  test('setMapboxStyleState method should be called', (): void => {
    const spy = vi.spyOn(mapboxStyleService, 'setMapboxStyleState')
    mapboxStyleService.setMapboxStyleState()
    expect(spy).toBeCalled()
  })
})
