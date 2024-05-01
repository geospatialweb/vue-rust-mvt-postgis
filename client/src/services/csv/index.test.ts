import { Container } from 'typedi'

import { Url } from '@/enums'
import { CsvService } from '@/services'

describe('CsvService test suite', (): void => {
  test('fetchCsv method should be called', async (): Promise<void> => {
    const hexagonLayerDataURL = Url.HEXAGON_LAYER_DATA_URL,
      csvService = Container.get(CsvService),
      spy = vi.spyOn(csvService, 'fetchCsv')
    await csvService.fetchCsv(hexagonLayerDataURL)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(hexagonLayerDataURL)
    expect(spy).toHaveReturnedTimes(1)
  })
})
