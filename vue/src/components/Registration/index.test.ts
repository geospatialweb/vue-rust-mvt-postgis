import { render, screen } from '@testing-library/vue'

import { Registration } from '@/components'

describe('Registration component test suite', (): void => {
  it('should render successfully', (): void => {
    render(Registration)
    const registration = screen.getByRole('presentation')
    expect(registration).toBeInTheDocument()
  })
})
