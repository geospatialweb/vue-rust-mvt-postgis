import { Container } from 'typedi'

import { DeckglService } from '@/services'

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export default function mockDeckImplementation(): any {
  const { deck, map } = Container.get(DeckglService)
  new DeckglService(deck, map)
}
