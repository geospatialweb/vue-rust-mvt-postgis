import userEvent from '@testing-library/user-event'
import { render, screen, within } from '@testing-library/vue'
import { createPinia, setActivePinia } from 'pinia'

import { LayerElements } from '@/components'
import { LayerId } from '@/enums'
import { testData } from '@/test'

describe('LayerElements component static test suite', (): void => {
  let listItems: HTMLElement[]
  const { layerElements } = testData,
    setup = (): void => {
      render(LayerElements)
      const list = screen.getByTestId('layers')
      listItems = within(list) && screen.getAllByRole('listitem')
    }

  beforeEach((): void => {
    setActivePinia(createPinia())
  })

  it(`should render list of ${layerElements.length} layers`, (): void => {
    setup()
    expect(listItems.length).toBe(layerElements.length)
  })

  it('should render list of layers in a specific order', (): void => {
    setup()
    const layers = listItems.map(({ textContent }) => textContent)
    expect(layers).toEqual(layerElements.map(({ name }) => name))
  })

  it('should render list of layers with icon class set correctly for each layer icon', (): void => {
    setup()
    const layers = listItems.map(({ firstChild }) => <HTMLElement>firstChild)
    for (const [idx, layer] of layers.entries()) {
      expect(layer.className).toMatch(new RegExp(`_${layerElements[idx].id}-icon`))
    }
  })

  it("should render list of layers with an initial class 'active' or 'inactive') for each layer", (): void => {
    setup()
    const layers = listItems.map(({ lastChild }) => <HTMLElement>lastChild)
    for (const [idx, layer] of layers.entries()) {
      expect(layer.className).toMatch(new RegExp(`_${layerElements[idx].className}`))
    }
  })
})

describe('LayerElements component click event test suite', (): void => {
  const { layerElements } = testData,
    user = userEvent.setup()

  test("Deck.GL layer class remains 'inactive' when clicked", async (): Promise<void> => {
    render(LayerElements)
    const layer = screen.getByText(layerElements[5].name)
    await user.click(layer)
    expect(layer.className).toMatch(/_inactive/)
  })

  test("Biosphere layer class changes to 'inactive' on click and 'active' on click again", async (): Promise<void> => {
    render(LayerElements)
    const layer = screen.getByText(layerElements[1].name)
    await user.click(layer)
    expect(layer.className).toMatch(/_inactive/)
    await user.click(layer)
    expect(layer.className).toMatch(/_active/)
  })

  test("Remaining layers class changes to 'active' on click and 'inactive' on click again", async (): Promise<void> => {
    render(LayerElements)
    for (const { id, name } of layerElements) {
      const biosphereLayer: string = LayerId.BIOSPHERE,
        deckglLayer: string = LayerId.DECKGL
      if (id !== biosphereLayer && id !== deckglLayer) {
        const layer = screen.getByText(name)
        await user.click(layer)
        expect(layer.className).toMatch(/_active/)
        await user.click(layer)
        expect(layer.className).toMatch(/_inactive/)
      }
    }
  })
})
