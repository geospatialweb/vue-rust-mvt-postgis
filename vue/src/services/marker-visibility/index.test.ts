import { Container } from 'typedi'

import { Layer } from '@/enums'
import { MarkerVisibilityService } from '@/services'
import { mockMapImplementation } from '@/test'

describe('MarkerVisibilityService test suite', (): void => {
  const markerVisibilityService = Container.get(MarkerVisibilityService)

  test('setHiddenMarkersVisibility method should be called', (): void => {
    const spy = vi.spyOn(markerVisibilityService, 'setHiddenMarkersVisibility')
    markerVisibilityService.setHiddenMarkersVisibility()
    expect(spy).toBeCalled()
  })

  test('toggleMarkerVisibility method should be called', (): void => {
    const id = `${Layer.Office}`,
      spy = vi.spyOn(markerVisibilityService, 'toggleMarkerVisibility').mockImplementation(mockMapImplementation)
    markerVisibilityService.toggleMarkerVisibility(id)
    expect(spy).toBeCalled()
    expect(spy).toBeCalledWith(id)
  })
})
