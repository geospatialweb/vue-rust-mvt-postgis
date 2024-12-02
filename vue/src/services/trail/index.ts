import { Container, Service } from 'typedi'

import { trails } from '@/configuration'
import { ITrail } from '@/interfaces'
import { MapboxService } from '@/services'

@Service()
export default class TrailService {
  #trails = <ITrail[]>[...trails]

  selectTrail(name: string): void {
    const isSelected = (trail: ITrail): boolean => trail.name === name,
      trail = this.#trails.find(isSelected)
    trail && this.#mapFlyTo(trail)
  }

  setInitialZoom(factor: number): void {
    const trails = [...this.#trails]
    for (const trail of trails) {
      if (trail.zoom) {
        trail.zoom = Number((trail.zoom * factor).toFixed(1))
      }
    }
    this.#trails = trails
  }

  #mapFlyTo(trail: ITrail): void {
    const mapboxService = Container.get(MapboxService)
    mapboxService.mapFlyTo(trail)
  }
}
