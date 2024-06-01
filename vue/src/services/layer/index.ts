import cloneDeep from 'lodash.clonedeep'
import { Service } from 'typedi'

import { layers } from '@/configuration'
import { ILayer } from '@/interfaces'

@Service()
export default class LayerService {
  #layers: ILayer[] = cloneDeep(layers)

  get layers() {
    return this.#layers
  }
}
