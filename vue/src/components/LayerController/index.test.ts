import userEvent from '@testing-library/user-event'
import { RenderResult, render, screen, within } from '@testing-library/vue'

import { LayerController } from '@/components'
import { Layer } from '@/enums'
import { testData } from '@/test'

describe('LayerController component test suite', (): void => {
  let listItems: HTMLElement[]
  const { layerControllerLayers: layers } = testData,
    setup = (): void => {
      render(LayerController)
      const list = screen.getByTestId('layers')
      listItems = within(list) && screen.getAllByRole('listitem')
    }

  it(`should render list of ${layers.length} layers`, (): void => {
    setup()
    expect(listItems.length).toBe(layers.length)
  })

  it('should render list of layers in a specific order', (): void => {
    setup()
    const testLayers = listItems.map(({ textContent }) => textContent)
    expect(testLayers).toEqual(layers.map(({ name }) => name))
  })

  it('should render list of layers with icon class set correctly for each layer icon', (): void => {
    setup()
    const testLayers = listItems.map(({ firstChild }) => <HTMLElement>firstChild)
    for (const [idx, layer] of testLayers.entries()) {
      expect(layer.className).toMatch(new RegExp(`_${layers[idx].id}-icon`))
    }
  })

  it("should render list of layers with an initial class 'active' or 'inactive' for each layer", (): void => {
    setup()
    const testLayers = listItems.map(({ lastChild }) => <HTMLElement>lastChild)
    for (const [idx, layer] of testLayers.entries()) {
      expect(layer.className).toMatch(new RegExp(`_${layers[idx].className}`))
    }
  })
})

describe('LayerController component click event test suite', (): void => {
  const { layerControllerLayers: layers } = testData,
    setup = (): RenderResult => render(LayerController),
    view = userEvent.setup()

  test("Deck.GL layer class remains 'inactive' when clicked", async (): Promise<void> => {
    setup()
    const layer = screen.getByText(layers[5].name)
    await view.click(layer)
    expect(layer.className).toMatch(/inactive/)
  })

  test("Biosphere layer class changes to 'inactive' on click and 'active' on click again", async (): Promise<void> => {
    setup()
    const layer = screen.getByText(layers[1].name)
    await view.click(layer)
    expect(layer.className).toMatch(/inactive/)
    await view.click(layer)
    expect(layer.className).toMatch(/active/)
  })

  test("Remaining layers class changes to 'active' on click and 'inactive' on click again", async (): Promise<void> => {
    setup()
    for (const { id, name } of layers) {
      if (id !== `${Layer.Biosphere}` && id !== `${Layer.Deckgl}`) {
        const layer = screen.getByText(name)
        await view.click(layer)
        expect(layer.className).toMatch(/active/)
        await view.click(layer)
        expect(layer.className).toMatch(/inactive/)
      }
    }
  })
})
