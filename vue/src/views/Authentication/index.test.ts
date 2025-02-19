import { render, screen } from '@testing-library/vue'

import { Authentication } from '@/components'
import { Authentication as AuthenticationView } from '@/views'

describe('Authentication view test suite', (): void => {
  it('should render successfully', (): void => {
    render(AuthenticationView)
    const authenticationView = screen.getAllByRole('presentation')[0]
    expect(authenticationView).toBeInTheDocument()
  })

  test('Authentication component renders successfully', (): void => {
    render(Authentication)
    const authenticationComponent = screen.getByRole('presentation')
    expect(authenticationComponent).toBeInTheDocument()
  })
})
