import { Store } from '@/enums'

import type { AxiosRequestConfig } from 'axios'
import type { DSVRowArray } from 'd3-dsv'
import type { FeatureCollection } from 'geojson'
import type { StoreDefinition } from 'pinia'
import type {
  IAppState,
  ICredentialsState,
  IDeckglSettingsState,
  IGeoJsonParam,
  IHexagonLayerControllerSliderLabelsState,
  IHexagonLayerState,
  IJwtState,
  ILayerControllerState,
  ILayerVisibilityState,
  IMapboxAccessToken,
  IMapboxSettingsState,
  IMapboxStylesState,
  IMarkerVisibilityState,
  IModalState,
  IStoreState,
  IUser
} from '@/interfaces'

export type CsvData = DSVRowArray<string> | undefined
export type HexagonLayerData = [] | number[][] | (() => Promise<number[][]>) | undefined
export type HttpRequest =
  | AxiosRequestConfig<ICredentialsState>
  | AxiosRequestConfig<IGeoJsonParam>
  | AxiosRequestConfig<IMapboxAccessToken>
export type HttpResponse = FeatureCollection | IJwtState | IMapboxAccessToken | IUser | undefined
export type LayerControllerHashmap = Record<string, (id: string) => void>
export type MapboxAccessToken = string | null | undefined
export type MarkersHashmap = Map<string, number>
export type MarkersReverseHashmap = Map<number, string>
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
  IStoreState,
  { getState: (state: IStoreState) => (id: string) => StoreState },
  { setState(id: string, state: StoreState): void }
>
