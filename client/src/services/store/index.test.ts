import { createPinia, setActivePinia } from 'pinia'
import { Container } from 'typedi'

import { StoreService } from '@/services'
import { testData } from '@/test'

describe('StoreService test suite', (): void => {
  let storeService: StoreService

  beforeEach((): void => {
    setActivePinia(createPinia())
    storeService = Container.get(StoreService)
  })

  test('getStoreState method should be called', (): void => {
    /* prettier-ignore */
    const { store: { id } } = testData,
      spy = vi.spyOn(storeService, 'getStoreState')
    storeService.getStoreState(id)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(id)
    expect(spy).toHaveReturnedTimes(1)
  })

  test('setStoreState method should be called', (): void => {
    /* prettier-ignore */
    const { store: { id, state } } = testData,
      spy = vi.spyOn(storeService, 'setStoreState')
    storeService.setStoreState(id, state)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(id, state)
  })
})
