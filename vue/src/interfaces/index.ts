import { LngLatLike } from 'mapbox-gl'

import { MediaQuery } from '@/types'

export interface IAppState {
  initialZoom: MediaQuery
  isMobile: boolean
}

export interface ICredentialsState {
  isAdmin?: boolean | undefined
  isCorrect?: boolean | undefined
  isValid?: boolean | undefined
  password?: string | undefined
  username?: string | undefined
}

export interface ICsvResponseError {
  message: string
  response: Record<string, string>
}

export interface IDeckglOption {
  canvas: string
  container: string
  controller: boolean
  id: string
  interactive: boolean
  style: string
}

export interface IDeckglSettingsState {
  bearing: number
  center: LngLatLike
  latitude: number
  longitude: number
  maxPitch: number
  maxZoom: number
  minZoom: number
  pitch: number
  zoom: number
}

export interface IGeoJSONProperty {
  description: string
  name: string
}

export interface IHexagonLayerControllerButton {
  id: string
  text: string
}

export interface IHexagonLayerControllerSlider {
  id: string
  min: string
  max: string
  step: string
  text: string
}

export interface IHexagonLayerControllerSliderInput {
  id: string
  value: string
}

export interface IHexagonLayerControllerSliderLabelsState {
  coverage: boolean
  elevationScale: boolean
  radius: boolean
  upperPercentile: boolean
}

export interface IHexagonLayerProp {
  colorRange: number[][]
  elevationRange: number[]
  extruded: boolean
  id: string
  material: {
    ambient: number
    diffuse: number
    shininess: number
    specularColor: number[]
  }
  pickable: boolean
  transitions: {
    coverage: number
    elevationScale: number
  }
}

export interface IHexagonLayerState {
  coverage: number
  elevationScale: number
  radius: number
  upperPercentile: number
}

export interface IHttpResponseError {
  message: string
  response: Record<string, string | number>
}

export interface IJwtState {
  jwtExpiry: number
  jwtToken: string
}

export interface ILayerControllerIcon {
  height: string
  id: string
  name: string
  src: string
  width: string
}

export interface ILayerControllerState {
  id: string
  isActive: boolean
  name: string
}

export interface ILayerVisibilityState {
  biosphere: {
    isActive: boolean
  }
  'biosphere-border': {
    isActive: boolean
  }
  trails: {
    isActive: boolean
  }
}

export interface IMapStyle {
  id: string
  isActive: boolean
  url: string
}

export interface IMapboxOption {
  container: string
  doubleClickZoom: boolean
}

export interface IMapboxSettingsState {
  bearing: number
  center: LngLatLike
  maxPitch: number
  maxZoom: number
  minZoom: number
  pitch: number
  style: string
  zoom: number
}

export interface IMapboxStylesState {
  outdoors: IMapStyle
  satellite: IMapStyle
}

export interface IMarkerVisibilityState {
  office: {
    isActive: boolean
    isHidden: boolean
  }
  places: {
    isActive: boolean
    isHidden: boolean
  }
  trails: {
    isActive: boolean
    isHidden: boolean
  }
}

export interface IModalState {
  isActive: boolean
}

export interface INavigationControl {
  position: string
  visualizePitch: boolean
}

export interface IQueryParam {
  columns: string
  id: string
}

export interface IState {
  app: IAppState
  credentials: ICredentialsState
  deckglSettings: IDeckglSettingsState
  hexagonLayer: IHexagonLayerState
  hexagonLayerControllerSliderLabels: IHexagonLayerControllerSliderLabelsState
  jwt: IJwtState
  layerController: ILayerControllerState[]
  layerVisibility: ILayerVisibilityState
  mapboxSettings: IMapboxSettingsState
  mapboxStyles: IMapboxStylesState
  markerVisibility: IMarkerVisibilityState
  modal: IModalState
}

export interface ITrail {
  center: LngLatLike
  name: string
  zoom: number
}
