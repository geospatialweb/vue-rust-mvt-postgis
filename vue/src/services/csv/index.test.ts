import { Container } from 'typedi'

import { URL } from '@/enums'
import { CsvService } from '@/services'

describe('CsvService test suite', (): void => {
  test('getCsvData method should be called with a return', async (): Promise<void> => {
    const url = URL.HexagonLayerData,
      csvService = Container.get(CsvService),
      spy = vi.spyOn(csvService, 'getCsvData')
    await csvService.getCsvData(url)
    expect(spy).toBeCalled()
    expect(spy).toBeCalledWith(url)
    expect(spy).toHaveReturned()
  })
})
