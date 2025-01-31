import { render, screen } from '@testing-library/vue'

import { Registration } from '@/components'
import { Registration as RegistrationView } from '@/views'

describe('Registration view test suite', (): void => {
  it('should render successfully', (): void => {
    render(RegistrationView)
    const registrationView = screen.getAllByRole('presentation')[0]
    expect(registrationView).toBeInTheDocument()
  })

  test('Registration component renders successfully', (): void => {
    render(Registration)
    const registrationComponent = screen.getByRole('presentation')
    expect(registrationComponent).toBeInTheDocument()
  })
})
