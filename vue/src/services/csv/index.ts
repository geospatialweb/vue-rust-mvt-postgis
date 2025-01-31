import { csv } from 'd3-fetch'
import { Container, Service } from 'typedi'

import { LogService } from '@/services'

import type { ICsvResponseError } from '@/interfaces'
import type { CsvData } from '@/types'

@Service()
export default class CsvService {
  #csv

  constructor() {
    this.#csv = csv
  }

  getCsvData = async (url: string): Promise<CsvData> => {
    return this.#csv(url)
      .then((data): CsvData => data)
      .catch(({ message, response: { data } }: ICsvResponseError): undefined => {
        const { logErrorMessage } = Container.get(LogService)
        message ? logErrorMessage(message) : logErrorMessage(data)
      })
  }
}
