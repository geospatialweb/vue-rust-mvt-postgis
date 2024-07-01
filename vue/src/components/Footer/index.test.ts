import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/vue'

import { Footer } from '@/components'

describe('Footer component test suite', (): void => {
  let footer: HTMLElement
  const setup = (): void => {
    render(Footer)
    footer = screen.getByRole('contentinfo', { name: 'footer' })
  }

  it('should render successfully', (): void => {
    setup()
    expect(footer).toBeInTheDocument()
  })

  test('class set correctly to "active"', (): void => {
    setup()
    expect(footer.className).toMatch(/active/)
  })

  test('text displays correctly', (): void => {
    setup()
    expect(footer).toHaveTextContent('Use Mouse Wheel to zoom in/out Hold down Shift key to rotate map')
  })
})
