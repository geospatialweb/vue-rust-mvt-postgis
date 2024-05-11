import '@testing-library/jest-dom'
import { RenderResult, fireEvent, render, screen } from '@testing-library/vue'
import { createPinia, setActivePinia } from 'pinia'
import { Container } from 'typedi'

import { HexagonUI } from '@/components'
import { hexagonUIButtons, hexagonUIHeading, hexagonUISliders } from '@/configuration'
import { IHexagonLayerState, IHexagonUIButton, IHexagonUISlider } from '@/interfaces'
import { HexagonLayerService } from '@/services'
import { testData } from '@/test'

describe('HexagonUI component test suite', (): void => {
  const setup = (): RenderResult => render(HexagonUI)

  beforeEach((): void => {
    setActivePinia(createPinia())
  })

  test('heading text set correctly', (): void => {
    setup()
    const { heading } = hexagonUIHeading,
      header = screen.getByRole('heading')
    expect(header).toHaveTextContent(heading)
  })

  test('label element text set correctly for each parameter', (): void => {
    setup()
    const sliders: IHexagonUISlider[] = hexagonUISliders
    for (const { id, text } of sliders) {
      const label = screen.getByTestId(id)
      expect(label).toHaveTextContent(text)
    }
  })

  test("label element class initially set to 'mouseout' for each parameter", (): void => {
    setup()
    const sliders: IHexagonUISlider[] = hexagonUISliders
    for (const { text } of sliders) {
      const label = screen.getByText(text)
      expect(label.className).toMatch(/_mouseout/)
    }
  })

  test('label element class set correctly during mouseover on input for each parameter', async (): Promise<void> => {
    setup()
    const sliders: IHexagonUISlider[] = hexagonUISliders
    for (const [idx, { text }] of sliders.entries()) {
      const label = screen.getByText(text),
        slider = screen.getAllByRole('slider')[idx]
      await fireEvent.mouseOver(slider)
      expect(label.className).toMatch(/_mouseover/)
    }
  })

  test('label element class set correctly during mouseout on input for each parameter', async (): Promise<void> => {
    setup()
    const sliders: IHexagonUISlider[] = hexagonUISliders
    for (const [idx, { text }] of sliders.entries()) {
      const label = screen.getByText(text),
        slider = screen.getAllByRole('slider')[idx]
      await fireEvent.mouseOut(slider)
      expect(label.className).toMatch(/_mouseout/)
    }
  })

  test('input element attributes set correctly for each parameter', (): void => {
    setup()
    const sliders: IHexagonUISlider[] = hexagonUISliders
    for (const [idx, { id, max, min, step }] of sliders.entries()) {
      const slider = screen.getAllByRole('slider')[idx]
      expect(slider).toHaveAttribute('id', id)
      expect(slider).toHaveAttribute('max', max)
      expect(slider).toHaveAttribute('min', min)
      expect(slider).toHaveAttribute('step', step)
    }
  })

  test('input element initial display value set correctly for each parameter', (): void => {
    setup()
    const sliders: IHexagonUISlider[] = hexagonUISliders,
      hexagonLayerService = Container.get(HexagonLayerService),
      { hexagonLayerState } = hexagonLayerService
    for (const [idx, { id }] of sliders.entries()) {
      const slider = screen.getAllByRole('slider')[idx]
      expect(slider).toHaveDisplayValue(String(hexagonLayerState[id as keyof IHexagonLayerState]))
    }
  })

  test('display correct input element display value when slider value changes', async () => {
    setup()
    const sliders: IHexagonUISlider[] = hexagonUISliders,
      { sliderValues } = testData
    for (const [idx] of sliders.entries()) {
      const slider = screen.getAllByRole('slider')[idx]
      await fireEvent.update(slider, sliderValues[idx])
      expect(slider).toHaveDisplayValue(sliderValues[idx])
    }
  })

  test('button id attribute set correctly', (): void => {
    setup()
    const buttons: IHexagonUIButton[] = hexagonUIButtons
    for (const [idx, { id }] of buttons.entries()) {
      const button = screen.getAllByRole('button')[idx]
      expect(button).toHaveAttribute('id', id)
    }
  })

  test('button text set correctly', (): void => {
    setup()
    const buttons: IHexagonUIButton[] = hexagonUIButtons
    for (const [idx, { text }] of buttons.entries()) {
      const button = screen.getAllByRole('button')[idx]
      expect(button).toHaveTextContent(text)
    }
  })
})
