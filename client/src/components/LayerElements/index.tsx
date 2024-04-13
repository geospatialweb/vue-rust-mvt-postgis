import 'vue/jsx'
import { Container } from 'typedi'
import { defineComponent } from 'vue'

import { LayerElement, LayerIcon } from '@/components'
import { layerIcons } from '@/configuration'
import { LayerId } from '@/enums'
import { ILayerElement } from '@/interfaces'
import { LayerElementService } from '@/services'
import styles from './index.module.css'

export default defineComponent({
  name: 'LayerElements',
  setup() {
    const { layerelement } = styles,
      layerElementService = Container.get(LayerElementService),
      getLayerElementsState = (): ILayerElement[] => {
        const { layerElementsState } = layerElementService
        return layerElementsState
      },
      displayLayerElement = (id: string): void => layerElementService.displayLayerElement(id as LayerId),
      onClickHandler = (evt: MouseEvent): void => {
        evt.stopPropagation()
        const { id } = evt.target as HTMLDivElement
        displayLayerElement(id.split('-icon')[0])
      },
      listItem = ({ id, isActive, name }: ILayerElement, idx: number): JSX.Element => (
        <li>
          <LayerIcon
            id={`${id}-icon`}
            key={id}
            name={name}
            src={layerIcons[idx].src}
            height={layerIcons[idx].height}
            width={layerIcons[idx].width}
          />
          <LayerElement id={id} key={id} name={name} isActive={isActive} />
        </li>
      ),
      jsx = (layerElements: ILayerElement[]) => (
        <ul class={layerelement} data-testid="layers" onClick={(evt): void => onClickHandler(evt)}>
          {layerElements.map(listItem)}
        </ul>
      )
    return (): JSX.Element => jsx(getLayerElementsState())
  }
})
