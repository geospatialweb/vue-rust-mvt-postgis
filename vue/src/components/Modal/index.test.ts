import { render, screen } from '@testing-library/vue'

import { Modal } from '@/components'

describe('Modal component test suite', (): void => {
  test('dynamic class set correctly', (): void => {
    render(Modal)
    const modal = screen.getByRole('presentation')
    expect(modal.className).toMatch(/inactive/)
  })
})
