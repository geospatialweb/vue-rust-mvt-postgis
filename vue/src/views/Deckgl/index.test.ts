import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/vue'
import { createPinia, setActivePinia } from 'pinia'

import { Deckgl, Footer, HexagonLayerController, Modal } from '@/components'
import { deckgl } from '@/configuration'
import { Deckgl as DeckglView } from '@/views'

describe('Deck view test suite', (): void => {
  beforeEach((): void => {
    setActivePinia(createPinia())
  })

  it('should render successfully', (): void => {
    render(DeckglView)
    const deckView = screen.getAllByRole('presentation')[0]
    expect(deckView).toBeInTheDocument()
  })

  test('Deckgl component renders successfully', (): void => {
    /* prettier-ignore */
    const { options: { canvas, container } } = deckgl
    render(Deckgl, { props: { canvas, container } })
    const deckglComponent = screen.getAllByRole('presentation')[0]
    expect(deckglComponent).toBeInTheDocument()
  })

  test('HexagonLayerController component renders successfully', (): void => {
    render(HexagonLayerController)
    const hexagonLayer = screen.getAllByRole('presentation')[0]
    expect(hexagonLayer).toBeInTheDocument()
  })

  test('Footer component renders successfully', (): void => {
    render(Footer)
    const footer = screen.getByRole('contentinfo', { name: 'footer' })
    expect(footer).toBeInTheDocument()
  })

  test('Modal component renders successfully', (): void => {
    render(Modal)
    const modal = screen.getByRole('presentation')
    expect(modal).toBeInTheDocument()
  })

  test('Modal component dynamic class set correctly', (): void => {
    render(Modal)
    const modal = screen.getByRole('presentation')
    expect(modal.className).toMatch(/active/)
  })
})
