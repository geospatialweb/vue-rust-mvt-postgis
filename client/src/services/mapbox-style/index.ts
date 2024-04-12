import { Container, Service } from 'typedi'

import { StoreStates } from '@/enums'
import { IMapStyle, IMapboxStyle, IStoreStates } from '@/interfaces'
import { StoreService } from '@/services'

@Service()
export default class MapboxStyleService {
  #storeService = Container.get(StoreService)
  #activeMapboxStyle = ''
  #storeStates: IStoreStates = StoreStates

  constructor() {
    this.setActiveMapboxStyle()
  }

  get activeMapboxStyle() {
    return this.#activeMapboxStyle
  }

  get mapboxStylesState() {
    return <IMapboxStyle>this.#storeService.getStoreState(this.#storeStates.MAPBOX_STYLES)
  }

  set #mapboxStylesState(state: IMapboxStyle) {
    this.#storeService.setStoreState(this.#storeStates.MAPBOX_STYLES, state)
  }

  setActiveMapboxStyle(): void {
    const mapboxStyles = this.mapboxStylesState,
      isActive = ({ isActive }: IMapStyle): boolean => isActive,
      { id } = <IMapStyle>Object.values(mapboxStyles).find(isActive)
    this.#activeMapboxStyle = id
  }

  setMapboxStylesState(): void {
    const mapboxStyles: IMapboxStyle = { ...this.mapboxStylesState },
      isActive = (mapStyle: IMapStyle): boolean => (mapStyle.isActive = !mapStyle.isActive)
    Object.values(mapboxStyles).forEach(isActive)
    this.#mapboxStylesState = mapboxStyles
  }
}
