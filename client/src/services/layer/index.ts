import cloneDeep from 'lodash.clonedeep'
import { Service } from 'typedi'

import { layers } from '@/configuration'
import { Url } from '@/enums'
import { ILayer, IUrl } from '@/interfaces'

@Service()
export default class LayerService {
  #layers: ILayer[] = cloneDeep(layers)
  #url: IUrl = Url

  constructor() {
    import.meta.env.PROD && this.#setBaseURL()
  }

  get layers() {
    return this.#layers
  }

  #setBaseURL(): void {
    const layers = cloneDeep(this.#layers)
    for (const layer of layers) {
      /* prettier-ignore */
      const { source: { url } } = layer
      layer.source.url = url.replace(this.#url.MVT_BASE_URL_DEV, this.#url.MVT_BASE_URL_PROD)
    }
    this.#layers = cloneDeep(layers)
  }
}
