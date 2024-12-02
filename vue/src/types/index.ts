import { DSVRowArray } from 'd3-dsv'
import { FeatureCollection } from 'geojson'
import { StoreDefinition } from 'pinia'

import { Store } from '@/enums'
import {
  IAppState,
  ICredentialsState,
  IDeckglSettingsState,
  IHexagonLayerControllerSliderLabelsState,
  IHexagonLayerState,
  IJwtState,
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
export type HttpResponse = FeatureCollection | IJwtState | string | void
export type LayerControllerHashmap = Record<string, (id: string) => void>
export type MediaQuery = Record<string, number> | undefined
export type MediaQueryCollection = Record<string, MediaQuery>
export type NavigationControlPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
export type StoreState =
  | IAppState
  | ICredentialsState
  | IDeckglSettingsState
  | IHexagonLayerControllerSliderLabelsState
  | IHexagonLayerState
  | IJwtState
  | ILayerControllerState[]
  | ILayerVisibilityState
  | IMapboxSettingsState
  | IMapboxStylesState
  | IMarkerVisibilityState
  | IModalState
export type UseStoreDefinition = StoreDefinition<
  Store.State,
  IState,
  { getState: (state: IState) => (id: string) => StoreState },
  { setState(id: string, state: StoreState): void }
>
