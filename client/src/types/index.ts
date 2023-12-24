import { DSVRowArray } from 'd3-dsv'
import { FeatureCollection } from 'geojson'
import { StoreDefinition } from 'pinia'

import { LayerId } from '@/enums'
import {
  IApp,
  ICredential,
  IDeckglSetting,
  IHexagonLayerProp,
  IHexagonUILabelElement,
  IJWT,
  ILayerElement,
  ILayerVisibility,
  IMapboxSetting,
  IMapboxStyle,
  IMarkerVisibility,
  IModal,
  IStoreState
} from '@/interfaces'

export type CsvResponse = DSVRowArray<string> | void
export type HexagonLayerData = number[][]
export type HttpResponse = FeatureCollection | IJWT | string | void
export type LayerElementsHashmap = Record<string, (id: LayerId) => void>
export type MediaQuery = Record<string, number> | undefined
export type MediaQueryCollection = Record<string, MediaQuery>
export type NavigationControlPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
export type StoreState =
  | IApp
  | ICredential
  | IDeckglSetting
  | IHexagonLayerProp
  | IHexagonUILabelElement
  | IJWT
  | ILayerElement[]
  | ILayerVisibility
  | IMapboxSetting
  | IMapboxStyle
  | IMarkerVisibility
  | IModal
export type UseStoreDefinition = StoreDefinition<
  'store',
  IStoreState,
  { getState: (state: IStoreState) => (id: string) => StoreState },
  { setState(id: string, state: StoreState): void }
>
