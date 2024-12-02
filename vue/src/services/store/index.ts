import { defineStore } from 'pinia'
import { Service } from 'typedi'

import {
  app,
  credentials,
  deckgl,
  hexagonLayer,
  hexagonLayerControllerSliderLabels,
  jwt,
  layerControllerLayers,
  layerVisibility,
  mapbox,
  markerVisibility,
  modal
} from '@/configuration'
import { State, Store } from '@/enums'
import {
  IAppState,
  ICredentialsState,
  IDeckglSettingsState,
  IHexagonLayerState,
  IHexagonLayerControllerSliderLabelsState,
  IJwtState,
  ILayerControllerState,
  ILayerVisibilityState,
  IMapboxSettingsState,
  IMapboxStylesState,
  IMarkerVisibilityState,
  IModalState,
  IState
} from '@/interfaces'
import { StoreState, UseStoreDefinition } from '@/types'

@Service()
export default class StoreService {
  #app: IAppState = { ...app }
  #credentials: ICredentialsState = { ...credentials }
  #deckglSettings: IDeckglSettingsState = { ...deckgl.settings }
  #hexagonLayer: IHexagonLayerState = { ...hexagonLayer.state }
  #hexagonLayerControllerSliderLabels: IHexagonLayerControllerSliderLabelsState = {
    ...hexagonLayerControllerSliderLabels
  }
  #jwt: IJwtState = { ...jwt }
  #layerController: ILayerControllerState[] = [...layerControllerLayers]
  #layerVisibility: ILayerVisibilityState = { ...layerVisibility }
  #mapboxSettings: IMapboxSettingsState = { ...mapbox.settings }
  #mapboxStyles: IMapboxStylesState = { ...mapbox.styles }
  #markerVisibility: IMarkerVisibilityState = { ...markerVisibility }
  #modal: IModalState = { ...modal }
  #useStore: UseStoreDefinition = defineStore(Store.State, {})

  constructor() {
    this.#defineUseStore()
  }

  getState(id: string): StoreState {
    return this.#useStore().getState(id)
  }

  setState(id: string, state: StoreState): void {
    this.#useStore().setState(id, state)
  }

  #defineUseStore(): void {
    this.#useStore = defineStore(Store.State, {
      state: (): IState => ({
        [State.App]: this.#app,
        [State.Credentials]: this.#credentials,
        [State.DeckglSettings]: this.#deckglSettings,
        [State.HexagonLayer]: this.#hexagonLayer,
        [State.HexagonLayerControllerSliderLabels]: this.#hexagonLayerControllerSliderLabels,
        [State.Jwt]: this.#jwt,
        [State.LayerController]: this.#layerController,
        [State.LayerVisibility]: this.#layerVisibility,
        [State.MapboxSettings]: this.#mapboxSettings,
        [State.MapboxStyles]: this.#mapboxStyles,
        [State.MarkerVisibility]: this.#markerVisibility,
        [State.Modal]: this.#modal
      }),
      actions: {
        setState(id: string, state: StoreState): void {
          this.$patch({ [id]: state })
        }
      },
      getters: {
        getState: (state: IState): ((id: string) => StoreState) => {
          return (id: string): StoreState => state[id as keyof IState]
        }
      }
    })
  }
}
