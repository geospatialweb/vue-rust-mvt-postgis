import { Container, Service } from 'typedi'

import { URL } from '@/enums'
import { CsvService, LogService } from '@/services'

import type { CsvData, HexagonLayerData } from '@/types'

@Service()
export default class HexagonLayerDataService {
  getHexagonLayerData = async (): Promise<HexagonLayerData> => {
    const url = URL.HexagonLayerData,
      data = await this.#getCsvData(url)
    return this.#setHexagonLayerData(data)
  }

  async #getCsvData(url: string): Promise<CsvData> {
    const { getCsvData } = Container.get(CsvService)
    return getCsvData(url)
  }

  async #setHexagonLayerData(data: CsvData): Promise<HexagonLayerData> {
    if (!data?.length) {
      const { logErrorMessage } = Container.get(LogService)
      return <undefined>logErrorMessage(`no ${this.#setHexagonLayerData.name.slice(4)} found`)
    }
    return new Promise((resolve): void => {
      const hexagonLayerData = data.map((coord): number[] => [Number(coord.lng), Number(coord.lat)])
      resolve(hexagonLayerData)
    })
  }
}
