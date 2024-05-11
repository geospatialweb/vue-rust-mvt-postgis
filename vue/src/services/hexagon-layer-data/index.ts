import { DSVRowArray } from 'd3-dsv'
import { Container, Service } from 'typedi'

import { Url } from '@/enums'
import { CsvService } from '@/services'
import { CsvResponse, HexagonLayerData } from '@/types'

@Service()
export default class HexagonLayerDataService {
  #csvService = Container.get(CsvService)

  #hexagonLayerData: HexagonLayerData = []
  #hexagonLayerDataUrl: string = Url.HEXAGON_LAYER_DATA_URL

  constructor() {
    void this.#loadHexagonLayerData()
  }

  get hexagonLayerData() {
    return this.#hexagonLayerData
  }

  async #loadHexagonLayerData(): Promise<void> {
    const data = await this.#getHexagonLayerData(this.#hexagonLayerDataUrl)
    this.#setHexagonLayerData(<DSVRowArray<string>>data)
  }

  async #getHexagonLayerData(url: string): Promise<CsvResponse> {
    return this.#csvService.fetchCsv(url)
  }

  #setHexagonLayerData(data: DSVRowArray<string>): void {
    if (!data?.length) return this.#consoleError(`no ${this.#setHexagonLayerData.name.slice(4)} found`)
    this.#hexagonLayerData = data.map((d): number[] => [Number(d.lng), Number(d.lat)])
  }

  #consoleError(msg: string): void {
    import.meta.env.DEV && console.error(msg)
  }
}
