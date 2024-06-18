import 'vue/jsx'
import { Container } from 'typedi'
import { defineComponent } from 'vue'

import { Layer, LayerIcon } from '@/components'
import { layerIcons } from '@/configuration'
import { ILayerControllerState } from '@/interfaces'
import { LayerControllerService } from '@/services'
import styles from './index.module.css'

export default defineComponent({
  name: 'LayerController Component',
  setup() {
    const { layer } = styles,
      layerControllerService = Container.get(LayerControllerService),
      getLayerControllerState = (): ILayerControllerState[] => {
        const { layerControllerState } = layerControllerService
        return layerControllerState
      },
      onClickHandler = (evt: MouseEvent): void => {
        evt.stopPropagation()
        const { id } = evt.target as HTMLDivElement
        layerControllerService.displayLayer(id.split('-icon')[0])
      },
      listItem = ({ id, isActive, name }: ILayerControllerState, idx: number): JSX.Element => (
        <li>
          <LayerIcon
            id={`${id}-icon`}
            key={id}
            name={name}
            src={layerIcons[idx].src}
            height={layerIcons[idx].height}
            width={layerIcons[idx].width}
          />
          <Layer id={id} key={id} name={name} isActive={isActive} />
        </li>
      ),
      jsx = (layers: ILayerControllerState[]): JSX.Element => (
        <ul class={layer} data-testid="layers" onClick={(evt): void => onClickHandler(evt)}>
          {layers.map(listItem)}
        </ul>
      )
    return (): JSX.Element => jsx(getLayerControllerState())
  }
})
