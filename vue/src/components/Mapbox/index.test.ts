import { render, screen } from '@testing-library/vue'

import { Mapbox } from '@/components'
import { mapbox } from '@/configuration'

describe('Mapbox component test suite', (): void => {
  test('attributes set correctly', (): void => {
    const { container } = mapbox.options
    render(Mapbox, { props: { container } })
    const el = screen.getByRole('presentation')
    expect(el.id).toBe(container)
    expect(el.className).toMatch(new RegExp(container))
  })
})
