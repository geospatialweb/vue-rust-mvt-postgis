import { createPinia, setActivePinia } from 'pinia'
import { Container } from 'typedi'

import { hexagonUISliders as sliders } from '@/configuration'
import { HexagonUIService } from '@/services'

describe('HexagonUIService test suite', (): void => {
  setActivePinia(createPinia())

  test('setHexagonUILabelElementState method should be called', (): void => {
    const id = sliders[0].id,
      hexagonUIService = Container.get(HexagonUIService),
      spy = vi.spyOn(hexagonUIService, 'setHexagonUILabelElementState')
    hexagonUIService.setHexagonUILabelElementState(id)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(id)
    expect(spy).toHaveReturnedTimes(1)
  })
})
