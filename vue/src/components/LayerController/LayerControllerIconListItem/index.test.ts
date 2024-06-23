import { mount } from '@vue/test-utils'

import { LayerControllerIconListItem } from '@/components'
import { testData } from '@/test'

describe('LayerControllerIconListItem component test suite', (): void => {
  it('should receive correct props for each icon', (): void => {
    const { layerControllerIcons } = testData
    for (const { height, id, name, src, width } of layerControllerIcons) {
      const wrapper = mount(LayerControllerIconListItem, {
        props: {
          height,
          id,
          name,
          src,
          width
        }
      })
      expect(wrapper.props().height).toBe(height)
      expect(wrapper.props().id).toBe(id)
      expect(wrapper.props().name).toBe(name)
      expect(wrapper.props().src).toBe(src)
      expect(wrapper.props().width).toBe(width)
    }
  })
})
