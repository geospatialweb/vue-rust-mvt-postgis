import { Container, Service } from 'typedi'

import { StoreState } from '@/enums'
import { IMapStyle, IMapboxStyle } from '@/interfaces'
import { StoreService } from '@/services'

@Service()
export default class MapboxStyleService {
  #storeService = Container.get(StoreService)

  #activeMapboxStyle = ''
  #mapboxStylesStoreState: string = StoreState.MAPBOX_STYLES

  constructor() {
    this.setActiveMapboxStyle()
  }

  get activeMapboxStyle() {
    return this.#activeMapboxStyle
  }

  get mapboxStylesState() {
    return <IMapboxStyle>this.#storeService.getStoreState(this.#mapboxStylesStoreState)
  }

  set #mapboxStylesState(state: IMapboxStyle) {
    this.#storeService.setStoreState(this.#mapboxStylesStoreState, state)
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
