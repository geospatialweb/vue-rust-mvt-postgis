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
      .catch(({ message, response }: ICsvResponseError) => {
        if (!response) return this.#consoleError(message)
        const { data } = response
        this.#consoleError(data)
      })
  }

  #consoleError(msg: string): void {
    import.meta.env.DEV && console.error(msg)
  }
}
