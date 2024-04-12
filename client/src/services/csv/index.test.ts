import { Container } from 'typedi'

import { Url } from '@/enums'
import { CsvService } from '@/services'

describe('CsvService test suite', (): void => {
  test('fetchCsv method should be called', async (): Promise<void> => {
    const csvService = Container.get(CsvService),
      spy = vi.spyOn(csvService, 'fetchCsv')
    await csvService.fetchCsv(Url.HEXAGON_LAYER_DATA_URL)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(Url.HEXAGON_LAYER_DATA_URL)
    expect(spy).toHaveReturnedTimes(1)
  })
})
