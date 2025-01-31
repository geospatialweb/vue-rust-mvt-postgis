import { Service } from 'typedi'

import { vectorLayers } from '@/configuration'

import type { LayerSpecification } from 'mapbox-gl'

@Service()
export default class VectorLayerService {
  #vectorLayers: LayerSpecification[]

  constructor() {
    this.#vectorLayers = <[]>[...vectorLayers]
  }

  get vectorLayers(): LayerSpecification[] {
    return this.#vectorLayers
  }
}
