import { render, screen } from '@testing-library/vue'
import { createPinia, setActivePinia } from 'pinia'

import { Mapbox } from '@/components'
import { mapbox } from '@/configuration'

describe('Mapbox component test suite', (): void => {
  setActivePinia(createPinia())

  test('attributes set correctly', (): void => {
    /* prettier-ignore */
    const { options: { container } } = mapbox
    render(Mapbox, { props: { container } })
    const el = screen.getByRole('presentation')
    expect(el.id).toBe(container)
    expect(el.className).toMatch(/mapbox/)
  })
})
