import { Container, Service } from 'typedi'

import { State } from '@/enums'
import { StoreService } from '@/services'

import type { IMapStyle, IMapboxStylesState } from '@/interfaces'

@Service()
export default class MapboxStyleService {
  #activeMapboxStyle = ''

  constructor() {
    this.setActiveMapboxStyle()
  }

  get activeMapboxStyle(): string {
    return this.#activeMapboxStyle
  }

  get mapboxStylesState(): IMapboxStylesState {
    const { getState } = Container.get(StoreService)
    return <IMapboxStylesState>getState(State.MapboxStyles)
  }

  set #mapboxStylesState(state: IMapboxStylesState) {
    const { setState } = Container.get(StoreService)
    setState(State.MapboxStyles, state)
  }

  setActiveMapboxStyle = (): void => {
    const isActive = ({ isActive }: IMapStyle): boolean => isActive,
      { url: style } = <IMapStyle>Object.values(this.mapboxStylesState).find(isActive)
    this.#activeMapboxStyle = style
  }

  setMapboxStyleState = (): void => {
    const mapboxStylesState = <IMapboxStylesState>{ ...this.mapboxStylesState },
      isActive = (mapStyle: IMapStyle): boolean => (mapStyle.isActive = !mapStyle.isActive)
    Object.values(mapboxStylesState).forEach(isActive)
    this.#mapboxStylesState = mapboxStylesState
  }
}
