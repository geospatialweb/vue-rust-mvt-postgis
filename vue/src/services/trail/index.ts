import cloneDeep from 'lodash.clonedeep'
import { Container, Service } from 'typedi'

import { trails } from '@/configuration'
import { ITrail } from '@/interfaces'
import { MapboxService } from '@/services'

@Service()
export default class TrailService {
  #mapboxService = Container.get(MapboxService)

  #trails: ITrail[] = <ITrail[]>cloneDeep(trails)

  selectTrail(name: string): void {
    const isSelected = (trail: ITrail): boolean => trail.name === name,
      trail = this.#trails.find(isSelected)
    trail && this.#mapFlyTo(trail)
  }

  setInitialZoom(factor: number): void {
    const trails = cloneDeep(this.#trails)
    for (const trail of trails) {
      trail.zoom && (trail.zoom = Number((trail.zoom * factor).toFixed(1)))
    }
    this.#trails = cloneDeep(trails)
  }

  #mapFlyTo(trail: ITrail): void {
    this.#mapboxService.mapFlyTo(trail)
  }
}
