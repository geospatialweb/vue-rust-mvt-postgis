import { createPinia, setActivePinia } from 'pinia'
import { Container } from 'typedi'

import { Layer } from '@/enums'
import { MarkerService } from '@/services'
import { mockMapImplementation } from '@/test'

describe('MarkerService test suite', (): void => {
  let markerService: MarkerService

  beforeEach((): void => {
    setActivePinia(createPinia())
    markerService = Container.get(MarkerService)
  })

  test('setHiddenMarkersVisibility method should be called', (): void => {
    const spy = vi.spyOn(markerService, 'setHiddenMarkersVisibility')
    markerService.setHiddenMarkersVisibility()
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveReturnedTimes(1)
  })

  test('toggleMarkerVisibility method should be called', (): void => {
    const officeLayer: string = Layer.OFFICE,
      spy = vi.spyOn(markerService, 'toggleMarkerVisibility').mockImplementation(mockMapImplementation)
    markerService.toggleMarkerVisibility(officeLayer)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(officeLayer)
    expect(spy).toHaveReturnedTimes(1)
  })
})
