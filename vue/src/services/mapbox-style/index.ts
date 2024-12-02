import { Container, Service } from 'typedi'

import { State } from '@/enums'
import { IMapStyle, IMapboxStylesState } from '@/interfaces'
import { StoreService } from '@/services'

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
    const storeService = Container.get(StoreService)
    return <IMapboxStylesState>storeService.getState(State.MapboxStyles)
  }

  set #mapboxStylesState(state: IMapboxStylesState) {
    const storeService = Container.get(StoreService)
    storeService.setState(State.MapboxStyles, state)
  }

  setActiveMapboxStyle(): void {
    const mapboxStylesState = this.mapboxStylesState,
      isActive = ({ isActive }: IMapStyle): boolean => isActive,
      { id } = <IMapStyle>Object.values(mapboxStylesState).find(isActive)
    this.#activeMapboxStyle = id
  }

  setMapboxStyleState(): void {
    const mapboxStylesState = <IMapboxStylesState>{ ...this.mapboxStylesState },
      isActive = (mapStyle: IMapStyle): boolean => (mapStyle.isActive = !mapStyle.isActive)
    Object.values(mapboxStylesState).forEach(isActive)
    this.#mapboxStylesState = mapboxStylesState
  }
}
