import { Container } from 'typedi'

import { Layer } from '@/enums'
import { MarkerVisibilityService } from '@/services'
import { mockMapImplementation } from '@/test'

describe('MarkerVisibilityService test suite', (): void => {
  const markerVisibilityService = Container.get(MarkerVisibilityService)

  test('setHiddenMarkersVisibility method should be called', (): void => {
    const spy = vi.spyOn(markerVisibilityService, 'setHiddenMarkersVisibility')
    markerVisibilityService.setHiddenMarkersVisibility()
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveReturnedTimes(1)
  })

  test('toggleMarkerVisibility method should be called', (): void => {
    const spy = vi.spyOn(markerVisibilityService, 'toggleMarkerVisibility').mockImplementation(mockMapImplementation)
    markerVisibilityService.toggleMarkerVisibility(Layer.Office)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(Layer.Office)
    expect(spy).toHaveReturnedTimes(1)
  })
})
