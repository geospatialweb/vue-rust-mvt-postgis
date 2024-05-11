import { render, screen } from '@testing-library/vue'
import { createPinia, setActivePinia } from 'pinia'

import { Modal } from '@/components'

describe('Modal component test suite', (): void => {
  setActivePinia(createPinia())

  test('dynamic class set correctly', (): void => {
    render(Modal)
    const modal = screen.getByRole('presentation')
    expect(modal.className).toMatch(/inactive/)
  })
})
