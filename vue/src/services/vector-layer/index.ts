import cloneDeep from 'lodash.clonedeep'
import { Service } from 'typedi'

import { vectorLayers } from '@/configuration'
import { IVectorLayer } from '@/interfaces'

@Service()
export default class VectorLayerService {
  #vectorLayers: IVectorLayer[] = cloneDeep(vectorLayers)

  get vectorLayers() {
    return this.#vectorLayers
  }
}
