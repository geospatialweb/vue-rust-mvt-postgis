import { Container } from 'typedi'

import { MarkerService } from '@/services'
import { testData } from '@/test'

describe('MarkerService test suite', (): void => {
  const markerService = Container.get(MarkerService)

  test('markers getter should be called', (): void => {
    const spy = vi.spyOn(markerService, 'markers', 'get')
    markerService.markers
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveReturnedTimes(1)
  })

  test('markersHashmap getter should be called', (): void => {
    const spy = vi.spyOn(markerService, 'markersHashmap', 'get')
    markerService.markersHashmap
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveReturnedTimes(1)
  })

  test('reverseMarkersHashmap getter should be called', (): void => {
    const spy = vi.spyOn(markerService, 'reverseMarkersHashmap', 'get')
    markerService.reverseMarkersHashmap
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveReturnedTimes(1)
  })

  test('setMarkerFeatures method should be called', async (): Promise<void> => {
    const { jwtToken } = testData,
      spy = vi.spyOn(markerService, 'setMarkerFeatures')
    await markerService.setMarkerFeatures(jwtToken)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(jwtToken)
    expect(spy).toHaveReturnedTimes(1)
  })
})
