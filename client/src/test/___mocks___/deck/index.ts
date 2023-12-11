import { Container } from 'typedi'

import { DeckglService } from '@/services'

/* eslint-disable */
export default function mockDeckImplementation(): any {
  const { deck, map } = Container.get(DeckglService)
  new DeckglService(deck, map)
}
