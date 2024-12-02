import { mount } from '@vue/test-utils'

import { LayerControllerLayerListItem } from '@/components'
import { testData } from '@/test'

describe('LayerControllerLayerListItem component test suite', (): void => {
  it('should receive correct props for each layer', (): void => {
    const { layerControllerLayers } = testData
    for (const { id, isActive, name } of layerControllerLayers) {
      const wrapper = mount(LayerControllerLayerListItem, { props: { id, isActive, name } })
      expect(wrapper.props().id).toBe(id)
      expect(wrapper.props().isActive).toBe(isActive)
      expect(wrapper.props().name).toBe(name)
    }
  })
})
