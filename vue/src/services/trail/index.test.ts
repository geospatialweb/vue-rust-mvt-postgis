import { Container } from 'typedi'

import { TrailService } from '@/services'
import { mockMapImplementation, testData } from '@/test'

describe('TrailService test suite', (): void => {
  const trailService = Container.get(TrailService)

  test('selectTrail method should be called', (): void => {
    const { name } = testData.trailParams,
      spy = vi.spyOn(trailService, 'selectTrail').mockImplementation(mockMapImplementation)
    trailService.selectTrail(name)
    expect(spy).toBeCalled()
    expect(spy).toBeCalledWith(name)
  })

  test('setInitialZoom method should be called', (): void => {
    const { initialZoomFactor: factor } = testData,
      spy = vi.spyOn(trailService, 'setInitialZoom')
    trailService.setInitialZoom(factor)
    expect(spy).toBeCalled()
    expect(spy).toBeCalledWith(factor)
  })
})
