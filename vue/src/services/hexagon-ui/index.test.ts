import { createPinia, setActivePinia } from 'pinia'
import { Container } from 'typedi'

import { hexagonUISliders } from '@/configuration'
import { IHexagonUISlider } from '@/interfaces'
import { HexagonUIService } from '@/services'

describe('HexagonUIService test suite', (): void => {
  setActivePinia(createPinia())

  test('setHexagonUILabelState method should be called', (): void => {
    const sliders: IHexagonUISlider[] = hexagonUISliders,
      id = sliders[0].id,
      hexagonUIService = Container.get(HexagonUIService),
      spy = vi.spyOn(hexagonUIService, 'setHexagonUILabelState')
    hexagonUIService.setHexagonUILabelState(id)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(id)
    expect(spy).toHaveReturnedTimes(1)
  })
})
