import { createPinia, setActivePinia } from 'pinia'
import { Container } from 'typedi'

import { TrailService } from '@/services'
import { mockMapImplementation, testData } from '@/test'

describe('TrailService test suite', (): void => {
  let trailService: TrailService

  beforeAll((): void => {
    setActivePinia(createPinia())
    trailService = Container.get(TrailService)
  })

  test('selectTrail method should be called', (): void => {
    /* prettier-ignore */
    const { trailParams: { name } } = testData,
      spy = vi.spyOn(trailService, 'selectTrail').mockImplementation(mockMapImplementation)
    trailService.selectTrail(name)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(name)
    expect(spy).toHaveReturnedTimes(1)
  })

  test('setInitialZoom method should be called', (): void => {
    const { initialZoomFactor: factor } = testData,
      spy = vi.spyOn(trailService, 'setInitialZoom')
    trailService.setInitialZoom(factor)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(factor)
    expect(spy).toHaveReturnedTimes(1)
  })
})
