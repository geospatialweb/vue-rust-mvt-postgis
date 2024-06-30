import { csv } from 'd3-fetch'
import { Service } from 'typedi'

import { ICsvResponseError } from '@/interfaces'
import { CsvResponse } from '@/types'

@Service()
export default class CsvService {
  #csv = csv

  async fetchCsv(url: string): Promise<CsvResponse> {
    return this.#csv(url)
      .then((data) => data)
      .catch(({ message, response: { data } }: ICsvResponseError) => {
        data ? this.#logConsoleErrorMessage(data) : this.#logConsoleErrorMessage(message)
      })
  }

  #logConsoleErrorMessage(msg: string): void {
    console.error(msg)
  }
}
