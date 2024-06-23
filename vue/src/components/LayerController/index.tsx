import 'vue/jsx'
import { Container } from 'typedi'
import { defineComponent } from 'vue'

import { LayerControllerIconListItem, LayerControllerLayerListItem } from '@/components'
import { layerControllerIcons } from '@/configuration'
import { ILayerControllerState } from '@/interfaces'
import { LayerControllerService } from '@/services'
import styles from './index.module.css'

export default defineComponent({
  name: 'LayerController Component',
  setup() {
    const { layer_controller } = styles,
      layerControllerService = Container.get(LayerControllerService),
      getLayerControllerState = (): ILayerControllerState[] => {
        const { layerControllerState } = layerControllerService
        return layerControllerState
      },
      onClickHandler = (evt: MouseEvent): void => {
        evt.stopPropagation()
        const { id } = evt.target as HTMLElement
        layerControllerService.displayLayer(id.split('-icon')[0])
      },
      listItem = ({ id, isActive, name }: ILayerControllerState, idx: number): JSX.Element => (
        <li>
          <LayerControllerIconListItem
            id={`${id}-icon`}
            key={id}
            name={name}
            src={layerControllerIcons[idx].src}
            height={layerControllerIcons[idx].height}
            width={layerControllerIcons[idx].width}
          />
          <LayerControllerLayerListItem id={id} key={id} name={name} isActive={isActive} />
        </li>
      ),
      jsx = (layers: ILayerControllerState[]): JSX.Element => (
        <ul class={layer_controller} data-testid="layers" onClick={(evt): void => onClickHandler(evt)}>
          {layers.map(listItem)}
        </ul>
      )
    return (): JSX.Element => jsx(getLayerControllerState())
  }
})
