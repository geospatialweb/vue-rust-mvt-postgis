import { Container } from 'typedi'

import { MapboxService } from '@/services'

export default function mockMapImplementation(): void {
  const { map } = Container.get(MapboxService)
  new MapboxService(map)
}
