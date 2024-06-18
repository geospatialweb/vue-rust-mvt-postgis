import { Container } from 'typedi'

import { DeckglService } from '@/services'

/* eslint-disable */
export default function mockDeckImplementation(): any {
  const deckglService = Container.get(DeckglService),
    { deck, map } = deckglService
  new DeckglService(deck, map)
}
