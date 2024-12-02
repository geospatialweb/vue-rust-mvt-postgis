import { DSVRowArray } from 'd3-dsv'
import { Container, Service } from 'typedi'

import { URL } from '@/enums'
import { CsvService, LogService } from '@/services'
import { CsvResponse, HexagonLayerData } from '@/types'

@Service()
export default class HexagonLayerDataService {
  #hexagonLayerData: HexagonLayerData = []

  constructor() {
    void this.#loadHexagonLayerData()
  }

  get hexagonLayerData(): HexagonLayerData {
    return this.#hexagonLayerData
  }

  async #loadHexagonLayerData(): Promise<void> {
    const data = <DSVRowArray<string>>await this.#getHexagonLayerData(URL.HexagonLayerData)
    this.#setHexagonLayerData(data)
  }

  async #getHexagonLayerData(url: string): Promise<CsvResponse> {
    const csvService = Container.get(CsvService)
    return csvService.fetchCsv(url)
  }

  #setHexagonLayerData(data: DSVRowArray<string>): void {
    if (!data?.length) {
      const logService = Container.get(LogService)
      return logService.logHexagonLayerDataError(`no ${this.#setHexagonLayerData.name.slice(4)} found`)
    }
    this.#hexagonLayerData = data.map((d): number[] => [Number(d.lng), Number(d.lat)])
  }
}
