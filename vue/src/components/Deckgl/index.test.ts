import { RenderResult, render, screen } from '@testing-library/vue'

import { Deckgl } from '@/components'
import { deckgl } from '@/configuration'

describe('Deckgl component test suite', (): void => {
  /* prettier-ignore */
  const { options: { canvas, container } } = deckgl,
    setup = (): RenderResult => render(Deckgl, { props: { canvas, container } })

  test('container attributes set correctly', (): void => {
    setup()
    const el = screen.getAllByRole('presentation')[1]
    expect(el.id).toBe(container)
    expect(el.className).toMatch(new RegExp(container))
  })

  test('canvas attributes set correctly', (): void => {
    setup()
    const el = screen.getAllByRole('presentation')[2]
    expect(el.id).toBe(canvas)
    expect(el.className).toMatch(/hexagonlayer/)
  })
})
