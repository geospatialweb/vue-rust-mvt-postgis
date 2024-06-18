import cloneDeep from 'lodash.clonedeep'
import { Container, Service } from 'typedi'

import { State } from '@/enums'
import { IMapStyle, IMapboxStylesState } from '@/interfaces'
import { StoreService } from '@/services'

@Service()
export default class MapboxStyleService {
  #storeService = Container.get(StoreService)

  #activeMapboxStyle = ''

  constructor() {
    this.setActiveMapboxStyle()
  }

  get activeMapboxStyle() {
    return this.#activeMapboxStyle
  }

  get mapboxStylesState() {
    return <IMapboxStylesState>this.#storeService.getState(State.MAPBOX_STYLES)
  }

  set #mapboxStylesState(state: IMapboxStylesState) {
    this.#storeService.setState(State.MAPBOX_STYLES, state)
  }

  setActiveMapboxStyle(): void {
    const mapboxStylesState = this.mapboxStylesState,
      isActive = ({ isActive }: IMapStyle): boolean => isActive,
      { id } = <IMapStyle>Object.values(mapboxStylesState).find(isActive)
    this.#activeMapboxStyle = id
  }

  setMapboxStyleState(): void {
    const mapboxStylesState = cloneDeep(this.mapboxStylesState),
      isActive = (mapStyle: IMapStyle): boolean => (mapStyle.isActive = !mapStyle.isActive)
    Object.values(mapboxStylesState).forEach(isActive)
    this.#mapboxStylesState = mapboxStylesState
  }
}
