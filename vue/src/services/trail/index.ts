import { Container, Service } from 'typedi'

import { trails } from '@/configuration'
import { MapboxService } from '@/services'

import type { ITrail } from '@/interfaces'

@Service()
export default class TrailService {
  #trails: ITrail[]

  constructor() {
    this.#trails = <ITrail[]>[...trails]
  }

  selectTrail = (name: string): void => {
    const isSelected = (trail: ITrail): boolean => trail.name === name,
      trail = this.#trails.find(isSelected)
    trail && this.#mapFlyTo(trail)
  }

  setInitialZoom = (zoom: number): void => {
    const trails = [...this.#trails]
    for (const trail of trails) {
      trail.zoom = zoom
    }
    this.#trails = trails
  }

  #mapFlyTo(trail: ITrail): void {
    const { mapFlyTo } = Container.get(MapboxService)
    mapFlyTo(trail)
  }
}
