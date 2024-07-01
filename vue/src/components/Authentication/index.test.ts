import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/vue'

import { Authentication } from '@/components'

describe('Authentication component test suite', (): void => {
  it('should render successfully', (): void => {
    render(Authentication)
    const authentication = screen.getByRole('presentation')
    expect(authentication).toBeInTheDocument()
  })
})
