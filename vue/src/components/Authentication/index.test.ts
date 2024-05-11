import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/vue'
import { createPinia, setActivePinia } from 'pinia'

import { Authentication } from '@/components'

describe('Authentication component test suite', (): void => {
  beforeEach((): void => {
    setActivePinia(createPinia())
  })

  test('Authentication renders successfully', (): void => {
    render(Authentication)
    const authentication = screen.getByRole('presentation')
    expect(authentication).toBeInTheDocument()
  })
})
