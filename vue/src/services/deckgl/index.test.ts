import { Container } from 'typedi'

import { DeckglService } from '@/services'
import { mockDeckImplementation, testData } from '@/test'

describe('DeckglService test suite', (): void => {
  const deckglService = Container.get(DeckglService)

  test('deck getter should be called', (): void => {
    const spy = vi.spyOn(deckglService, 'deck', 'get')
    deckglService.deck
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveReturnedTimes(1)
  })

  test('map getter should be called', (): void => {
    const spy = vi.spyOn(deckglService, 'map', 'get')
    deckglService.map
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveReturnedTimes(1)
  })

  test('loadHexagonLayer method should be called', (): void => {
    const spy = vi.spyOn(deckglService, 'loadHexagonLayer').mockImplementation(mockDeckImplementation)
    deckglService.loadHexagonLayer()
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveReturnedTimes(1)
  })

  test('removeMapResources method should be called', (): void => {
    const spy = vi.spyOn(deckglService, 'removeMapResources').mockImplementation(mockDeckImplementation)
    deckglService.removeMapResources()
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveReturnedTimes(1)
  })

  test('setInitialZoomState method should be called', (): void => {
    const { initialZoom } = testData,
      spy = vi.spyOn(deckglService, 'setInitialZoomState').mockImplementation(mockDeckImplementation)
    deckglService.setInitialZoomState(initialZoom)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(initialZoom)
    expect(spy).toHaveReturnedTimes(1)
  })
})
