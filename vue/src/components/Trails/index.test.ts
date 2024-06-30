import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import { RenderResult, render, screen } from '@testing-library/vue'
import { createPinia, setActivePinia } from 'pinia'

import { Trails } from '@/components'
import { trails } from '@/configuration'

describe('Trails component test suite', (): void => {
  const setup = (): RenderResult => render(Trails),
    names = <string[]>trails.map((trail) => Object.values(trail)[0])

  beforeAll((): void => {
    setActivePinia(createPinia())
  })

  it('should display the correct number of options', (): void => {
    setup()
    const options: HTMLOptionElement[] = screen.getAllByRole('option')
    expect(options.length).toBe(trails.length + 1)
  })

  it('should set default option correctly', (): void => {
    setup()
    const option: HTMLOptionElement = screen.getByRole('option', { name: 'Select Trail' })
    expect(option.selected).toBe(true)
  })

  it.each(names)("should allow user to select '%s' trail", async (name): Promise<void> => {
    setup()
    const option: HTMLOptionElement = screen.getByRole('option', { name }),
      select: HTMLSelectElement = screen.getByLabelText('Select Trail')
    expect(option).toHaveValue(name)
    await userEvent.selectOptions(select, option)
    expect(option.selected).toBe(true)
  })
})
