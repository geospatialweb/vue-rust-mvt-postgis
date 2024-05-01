import { LngLatLike } from 'mapbox-gl'

import { MediaQuery } from '@/types'

export interface IApp {
  initialZoom: MediaQuery
  isMobile: boolean
}

export interface ICredential {
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

export interface IDeckglSetting {
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

export interface IHexagonLayerProp {
  coverage: number
  elevationScale: number
  radius: number
  upperPercentile: number
}

export interface IHexagonLayerPropState {
  id: string
  value: string
}

export interface IHexagonLayerStaticProp {
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

export interface IHexagonUILabelElement {
  coverage: boolean
  elevationScale: boolean
  radius: boolean
  upperPercentile: boolean
}

export interface IHexagonUIProp {
  label: IHexagonUILabelElement
  props: IHexagonLayerProp
}

export interface IHttpResponseError {
  message: string
  response: Record<string, string | number>
}

export interface IJWT {
  expiry: number
  token: string
}

export interface ILayer {
  id: string
  type: string
  source: {
    type: string
    url: string
  }
  'source-layer': string
  layout: {
    visibility: string
  }
  paint: {
    'fill-color'?: string | undefined
    'fill-opacity'?: number | undefined
    'fill-outline-color'?: string | undefined
    'line-color'?: string | undefined
    'line-width'?: number | undefined
  }
}

export interface ILayerElement {
  id: string
  isActive: boolean
  name: string
}

export interface ILayerIcon {
  height: string
  id: string
  name: string
  src: string
  width: string
}

export interface ILayerVisibility {
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

export interface IMapboxOption {
  container: string
  doubleClickZoom: boolean
}

export interface IMapboxSetting {
  bearing: number
  center: LngLatLike
  maxPitch: number
  maxZoom: number
  minZoom: number
  pitch: number
  style: string
  zoom: number
}

export interface IMapStyle {
  id: string
  isActive: boolean
  url: string
}

export interface IMapboxStyle {
  outdoors: IMapStyle
  satellite: IMapStyle
}

export interface IMarkerVisibility {
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

export interface IModal {
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

export interface ISlot {
  id: string
  text: string
}

export interface IStoreState {
  app: IApp
  credentials: ICredential
  deckglSettings: IDeckglSetting
  hexagonLayerProps: IHexagonLayerProp
  hexagonUILabelElement: IHexagonUILabelElement
  JWT: IJWT
  layerElements: ILayerElement[]
  layerVisibility: ILayerVisibility
  mapboxSettings: IMapboxSetting
  mapboxStyles: IMapboxStyle
  markerVisibility: IMarkerVisibility
  modal: IModal
}

export interface ITrail {
  center: LngLatLike
  name: string
  zoom: number
}
