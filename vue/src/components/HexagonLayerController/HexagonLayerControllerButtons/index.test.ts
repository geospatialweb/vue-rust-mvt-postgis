import userEvent from '@testing-library/user-event'
import { render, screen } from '@testing-library/vue'
import { mount } from '@vue/test-utils'
import { Container } from 'typedi'

import { HexagonLayerControllerButtons } from '@/components'
import { hexagonLayerControllerButtons } from '@/configuration'
import { RouterService } from '@/services'

import type { IHexagonLayerControllerButton } from '@/interfaces'

describe('HexagonLayerControllerButtons component test suite', (): void => {
  it('should receive correct `id` for each HexagonLayerController button', (): void => {
    const buttons: IHexagonLayerControllerButton[] = hexagonLayerControllerButtons
    for (const { id } of buttons) {
      const wrapper = mount(HexagonLayerControllerButtons, { props: { id } })
      expect(wrapper.props().id).toEqual(id)
    }
  })

  test("Mapbox route is called when 'Return to Trails' button is clicked", async (): Promise<void> => {
    render(HexagonLayerControllerButtons)
    const buttons = screen.getAllByRole('button'),
      { id: route } = hexagonLayerControllerButtons[1],
      routerService = Container.get(RouterService),
      spy = vi.spyOn(routerService, 'setRoute'),
      view = userEvent.setup()
    await view.click(buttons[1])
    await routerService.setRoute(route)
    expect(spy).toBeCalled()
    expect(spy).toBeCalledWith(route)
  })
})
