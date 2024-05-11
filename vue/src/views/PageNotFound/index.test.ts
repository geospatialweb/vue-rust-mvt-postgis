import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/vue'

import { PageNotFound } from '@/components'
import { PageNotFound as PageNotFoundView } from '@/views'

describe('PageNotFound view test suite', (): void => {
  it('should render successfully', (): void => {
    render(PageNotFoundView)
    const pageNotFoundView = screen.getAllByRole('presentation')[0]
    expect(pageNotFoundView).toBeInTheDocument()
  })

  test('PageNotFound component renders successfully', (): void => {
    render(PageNotFound)
    const pageNotFoundComponent = screen.getByRole('presentation')
    expect(pageNotFoundComponent).toBeInTheDocument()
  })
})
