import { csv } from 'd3-fetch'
import { Container, Service } from 'typedi'

import { ICsvResponseError } from '@/interfaces'
import { LogService } from '@/services'
import { CsvResponse } from '@/types'

@Service()
export default class CsvService {
  #csv = csv

  async fetchCsv(url: string): Promise<CsvResponse> {
    return this.#csv(url)
      .then((data) => data)
      .catch(({ message, response: { data } }: ICsvResponseError) => {
        const logService = Container.get(LogService)
        data ? logService.logCsvError(data) : logService.logCsvError(message)
      })
  }
}
