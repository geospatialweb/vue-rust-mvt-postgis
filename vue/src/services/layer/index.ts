import { LayerSpecification } from 'mapbox-gl'
import { Service } from 'typedi'

import { layers } from '@/configuration'

@Service()
export default class LayerService {
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-assignment */
  #layers: LayerSpecification[] = <any[]>[...layers]

  get layers(): LayerSpecification[] {
    return this.#layers
  }
}
