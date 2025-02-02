import { Feature } from 'geojson'
import { LngLatLike } from 'mapbox-gl'
import { Container } from 'typedi'

import { PopupService } from '@/services'
import { mockMapImplementation, testData } from '@/test'

describe('PopupService test suite', (): void => {
  const popupService = Container.get(PopupService)

  test('addLayerPopup method should be called', (): void => {
    /* prettier-ignore */
    const { features, marker: { geometry: { coordinates } } } = testData,
      { properties } = <Feature>features[0],
      spy = vi.spyOn(popupService, 'addLayerPopup').mockImplementation(mockMapImplementation)
    popupService.addLayerPopup(<LngLatLike>coordinates, properties)
    expect(spy).toBeCalled()
    expect(spy).toBeCalledWith(<LngLatLike>coordinates, properties)
  })

  test('addMarkerPopup method should be called', (): void => {
    const { marker } = testData,
      spy = vi.spyOn(popupService, 'addMarkerPopup').mockImplementation(mockMapImplementation)
    popupService.addMarkerPopup(<Feature>marker)
    expect(spy).toBeCalled()
    expect(spy).toBeCalledWith(<Feature>marker)
  })

  test('removePopup method should be called', (): void => {
    const spy = vi.spyOn(popupService, 'removePopup').mockImplementation(mockMapImplementation)
    popupService.removePopup()
    expect(spy).toBeCalled()
  })
})
