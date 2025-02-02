import { Container } from 'typedi'

import { StoreService } from '@/services'
import { testData } from '@/test'

describe('StoreService test suite', (): void => {
  const storeService = Container.get(StoreService)

  test('get method should be called with a return', (): void => {
    const { id, state } = testData.store,
      spy = vi.spyOn(storeService, 'getState')
    storeService.getState(id)
    expect(spy).toBeCalled()
    expect(spy).toBeCalledWith(id)
    expect(spy).toHaveReturnedWith(state)
  })

  test('set method should be called', (): void => {
    const { id, state } = testData.store,
      spy = vi.spyOn(storeService, 'setState')
    storeService.setState(id, state)
    expect(spy).toBeCalled()
    expect(spy).toBeCalledWith(id, state)
  })
})
