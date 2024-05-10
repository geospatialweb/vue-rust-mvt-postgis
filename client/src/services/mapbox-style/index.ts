import { Container, Service } from 'typedi'

import { State } from '@/enums'
import { IMapStyle, IMapboxStyleState } from '@/interfaces'
import { StoreService } from '@/services'

@Service()
export default class MapboxStyleService {
  #storeService = Container.get(StoreService)

  #activeMapboxStyle = ''
  #mapboxStyles: string = State.MAPBOX_STYLES

  constructor() {
    this.setActiveMapboxStyle()
  }

  get activeMapboxStyle() {
    return this.#activeMapboxStyle
  }

  get mapboxStylesState() {
    return <IMapboxStyleState>this.#storeService.getState(this.#mapboxStyles)
  }

  set #mapboxStylesState(state: IMapboxStyleState) {
    this.#storeService.setState(this.#mapboxStyles, state)
  }

  setActiveMapboxStyle(): void {
    const mapboxStyles = this.mapboxStylesState,
      isActive = ({ isActive }: IMapStyle): boolean => isActive,
      { id } = <IMapStyle>Object.values(mapboxStyles).find(isActive)
    this.#activeMapboxStyle = id
  }

  setMapboxStylesState(): void {
    const mapboxStyles: IMapboxStyleState = { ...this.mapboxStylesState },
      isActive = (mapStyle: IMapStyle): boolean => (mapStyle.isActive = !mapStyle.isActive)
    Object.values(mapboxStyles).forEach(isActive)
    this.#mapboxStylesState = mapboxStyles
  }
}
