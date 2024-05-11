import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/vue'
import { createPinia, setActivePinia } from 'pinia'

import { Registration } from '@/components'

describe('Registration component test suite', (): void => {
  setActivePinia(createPinia())

  test('Registration renders successfully', (): void => {
    render(Registration)
    const registration = screen.getByRole('presentation')
    expect(registration).toBeInTheDocument()
  })
})
