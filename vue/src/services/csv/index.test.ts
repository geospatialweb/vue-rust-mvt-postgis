import { Container } from 'typedi'

import { URL } from '@/enums'
import { CsvService } from '@/services'

describe('CsvService test suite', (): void => {
  test('fetchCsv method should be called', async (): Promise<void> => {
    const csvService = Container.get(CsvService),
      spy = vi.spyOn(csvService, 'fetchCsv')
    await csvService.fetchCsv(URL.HexagonLayerData)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(URL.HexagonLayerData)
    expect(spy).toHaveReturnedTimes(1)
  })
})
