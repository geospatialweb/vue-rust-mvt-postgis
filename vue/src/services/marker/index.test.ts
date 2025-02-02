import { Container } from 'typedi'

import { MarkerService } from '@/services'
import { testData } from '@/test'

describe('MarkerService test suite', (): void => {
  const markerService = Container.get(MarkerService)

  test('markers getter should be called with a return', (): void => {
    const spy = vi.spyOn(markerService, 'markers', 'get')
    markerService.markers
    expect(spy).toBeCalled()
    expect(spy).toHaveReturned()
  })

  test('markersHashmap getter should be called with a return', (): void => {
    const { markersHashmap } = testData,
      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
      spy = vi.spyOn(markerService, 'markersHashmap', 'get').mockReturnValue(<any>markersHashmap)
    markerService.markersHashmap
    expect(spy).toBeCalled()
    expect(spy).toHaveReturned()
  })

  test('markersReverseHashmap getter should be called with a return', (): void => {
    const { markersReverseHashmap } = testData,
      /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
      spy = vi.spyOn(markerService, 'markersReverseHashmap', 'get').mockReturnValue(<any>markersReverseHashmap)
    markerService.markersReverseHashmap
    expect(spy).toBeCalled()
    expect(spy).toHaveReturned()
  })

  test('setMarkerFeatures method should be called', async (): Promise<void> => {
    const { jwtToken } = window.jwtState,
      spy = vi.spyOn(markerService, 'setMarkerFeatures')
    await markerService.setMarkerFeatures(jwtToken)
    expect(spy).toBeCalled()
  })
})
