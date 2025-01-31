import { Container } from 'typedi'

import { DeckglService } from '@/services'
import { mockDeckImplementation, testData } from '@/test'

describe('DeckglService test suite', (): void => {
  const deckglService = Container.get(DeckglService)

  test('deck getter should be called with a return', (): void => {
    const spy = vi.spyOn(deckglService, 'deck', 'get')
    deckglService.deck
    expect(spy).toBeCalled()
    expect(spy).toHaveReturned()
  })

  test('map getter should be called with a return', (): void => {
    const spy = vi.spyOn(deckglService, 'map', 'get')
    deckglService.map
    expect(spy).toBeCalled()
    expect(spy).toHaveReturned()
  })

  test('loadHexagonLayer method should be called', async (): Promise<void> => {
    const spy = vi.spyOn(deckglService, 'loadHexagonLayer').mockImplementation(mockDeckImplementation)
    await deckglService.loadHexagonLayer()
    expect(spy).toBeCalled()
  })

  test('removeMapResources method should be called', (): void => {
    const spy = vi.spyOn(deckglService, 'removeMapResources').mockImplementation(mockDeckImplementation)
    deckglService.removeMapResources()
    expect(spy).toBeCalled()
  })

  test('setInitialDeckZoomState method should be called', (): void => {
    const { initialZoom } = testData,
      spy = vi.spyOn(deckglService, 'setInitialDeckZoomState').mockImplementation(mockDeckImplementation)
    deckglService.setInitialDeckZoomState(initialZoom)
    expect(spy).toBeCalled()
    expect(spy).toBeCalledWith(initialZoom)
  })
})
