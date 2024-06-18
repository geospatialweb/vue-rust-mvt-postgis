import { Container } from 'typedi'

import { MapboxService } from '@/services'

export default function mockMapImplementation(): void {
  const mapboxService = Container.get(MapboxService),
    { map } = mapboxService
  new MapboxService(map)
}
