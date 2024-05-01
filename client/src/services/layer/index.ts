import cloneDeep from 'lodash.clonedeep'
import { Service } from 'typedi'

import { layers } from '@/configuration'
import { Url } from '@/enums'
import { ILayer } from '@/interfaces'

@Service()
export default class LayerService {
  #layers: ILayer[] = cloneDeep(layers)
  #mvtBaseUrlDev: string = Url.MVT_BASE_URL_DEV
  #mvtBaseUrlProd: string = Url.MVT_BASE_URL_PROD

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
      layer.source.url = url.replace(this.#mvtBaseUrlDev, this.#mvtBaseUrlProd)
    }
    this.#layers = cloneDeep(layers)
  }
}
