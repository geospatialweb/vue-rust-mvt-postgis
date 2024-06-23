import { DSVRowArray } from 'd3-dsv'
import { FeatureCollection } from 'geojson'
import { StoreDefinition } from 'pinia'

import {
  IAppState,
  ICredentialsState,
  IDeckglSettingsState,
  IHexagonLayerControllerSliderLabelsState,
  IHexagonLayerState,
  IJWTState,
  ILayerControllerState,
  ILayerVisibilityState,
  IMapboxSettingsState,
  IMapboxStylesState,
  IMarkerVisibilityState,
  IModalState,
  IState
} from '@/interfaces'

export type CsvResponse = DSVRowArray<string> | void
export type HexagonLayerData = number[][]
export type HttpResponse = FeatureCollection | IJWTState | string | void
export type LayerControllerHashmap = Record<string, (id: string) => void>
export type MediaQuery = Record<string, number> | undefined
export type MediaQueryCollection = Record<string, MediaQuery>
export type NavigationControlPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
export type State =
  | IAppState
  | ICredentialsState
  | IDeckglSettingsState
  | IHexagonLayerControllerSliderLabelsState
  | IHexagonLayerState
  | IJWTState
  | ILayerControllerState[]
  | ILayerVisibilityState
  | IMapboxSettingsState
  | IMapboxStylesState
  | IMarkerVisibilityState
  | IModalState
export type UseStoreDefinition = StoreDefinition<
  'store',
  IState,
  { getState: (state: IState) => (id: string) => State },
  { setState(id: string, state: State): void }
>
