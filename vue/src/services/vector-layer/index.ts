import { Service } from 'typedi'

import { vectorLayers } from '@/configuration'
import { IVectorLayer } from '@/interfaces'

@Service()
export default class VectorLayerService {
  #vectorLayers: IVectorLayer[] = [...vectorLayers]

  get vectorLayers() {
    return this.#vectorLayers
  }
}
