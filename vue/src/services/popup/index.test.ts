import { Feature } from 'geojson'
import { LngLatLike } from 'mapbox-gl'
import { createPinia, setActivePinia } from 'pinia'
import { Container } from 'typedi'

import { PopupService } from '@/services'
import { mockMapImplementation, testData } from '@/test'

describe('PopupService test suite', (): void => {
  let popupService: PopupService

  beforeEach((): void => {
    setActivePinia(createPinia())
    popupService = Container.get(PopupService)
  })

  test('addLayerPopup method should be called', (): void => {
    /* prettier-ignore */
    const { layer: { features }, marker: { geometry: { coordinates } } } = testData,
      { properties } = <Feature>features[0],
      spy = vi.spyOn(popupService, 'addLayerPopup').mockImplementation(mockMapImplementation)
    popupService.addLayerPopup(<LngLatLike>coordinates, properties)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(<LngLatLike>coordinates, properties)
    expect(spy).toHaveReturnedTimes(1)
  })

  test('addMarkerPopup method should be called', (): void => {
    const { marker } = testData,
      spy = vi.spyOn(popupService, 'addMarkerPopup').mockImplementation(mockMapImplementation)
    popupService.addMarkerPopup(<Feature>marker)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(<Feature>marker)
    expect(spy).toHaveReturnedTimes(1)
  })

  test('removePopup method should be called', (): void => {
    const spy = vi.spyOn(popupService, 'removePopup').mockImplementation(mockMapImplementation)
    popupService.removePopup()
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveReturnedTimes(1)
  })
})
