import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/vue'

import { Header } from '@/components'

describe('Header component test suite', (): void => {
  let link: HTMLElement
  const setup = (): void => {
    render(Header)
    link = screen.getByRole('link')
  }

  test('should render logo & text', (): void => {
    setup()
    const header = screen.getByRole('banner'),
      image = screen.getByRole('img')
    expect(header).toHaveTextContent(/Geospatial Web/)
    expect(header).toHaveTextContent(/Rust REST API - Martin MVT Tile Server - PostGIS/)
    expect(header).toHaveTextContent(/GitLab Repository/)
    expect(image).toBeInTheDocument()
    expect(link).toBeInTheDocument()
  })

  test('repo link works correctly', (): void => {
    setup()
    expect(link).toHaveAttribute('href', 'https://gitlab.com/geospatialweb/rust-mvt-postgis')
  })
})
