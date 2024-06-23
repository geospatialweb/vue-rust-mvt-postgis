import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/vue'

import { PageNotFound } from '@/components'

describe('PageNotFound component test suite', (): void => {
  it('should render successfully', (): void => {
    render(PageNotFound)
    const pageNotFound = screen.getByRole('presentation')
    expect(pageNotFound).toBeInTheDocument()
  })
})
