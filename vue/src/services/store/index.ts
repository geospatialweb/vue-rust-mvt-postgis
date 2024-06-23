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
import {
  IAppState,
  ICredentialsState,
  IDeckglSettingsState,
  IHexagonLayerState,
  IHexagonLayerControllerSliderLabelsState,
  IJWTState,
  ILayerControllerState,
  ILayerVisibilityState,
  IMapboxSettingsState,
  IMapboxStylesState,
  IMarkerVisibilityState,
  IModalState,
  IState
} from '@/interfaces'
import { State, UseStoreDefinition } from '@/types'

@Service()
export default class StoreService {
  #app: IAppState = { ...app }
  #credentials: ICredentialsState = { ...credentials }
  #deckglSettings: IDeckglSettingsState = { ...deckgl.settings }
  #hexagonLayer: IHexagonLayerState = { ...hexagonLayer.state }
  #hexagonLayerControllerSliderLabels: IHexagonLayerControllerSliderLabelsState = {
    ...hexagonLayerControllerSliderLabels
  }
  #jwt: IJWTState = { ...jwt }
  #layerController: ILayerControllerState[] = [...layerControllerLayers]
  #layerVisibility: ILayerVisibilityState = { ...layerVisibility }
  #mapboxSettings: IMapboxSettingsState = { ...mapbox.settings }
  #mapboxStyles: IMapboxStylesState = { ...mapbox.styles }
  #markerVisibility: IMarkerVisibilityState = { ...markerVisibility }
  #modal: IModalState = { ...modal }
  #useStore: UseStoreDefinition = defineStore('store', {})

  constructor() {
    this.#defineUseStore()
  }

  getState(id: string): State {
    return this.#useStore().getState(id)
  }

  setState(id: string, state: State): void {
    this.#useStore().setState(id, state)
  }

  #defineUseStore(): void {
    this.#useStore = defineStore('store', {
      state: (): IState => ({
        app: this.#app,
        credentials: this.#credentials,
        deckglSettings: this.#deckglSettings,
        hexagonLayer: this.#hexagonLayer,
        hexagonLayerControllerSliderLabels: this.#hexagonLayerControllerSliderLabels,
        jwt: this.#jwt,
        layerController: this.#layerController,
        layerVisibility: this.#layerVisibility,
        mapboxSettings: this.#mapboxSettings,
        mapboxStyles: this.#mapboxStyles,
        markerVisibility: this.#markerVisibility,
        modal: this.#modal
      }),
      actions: {
        setState(id: string, state: State): void {
          this.$patch({ [id]: state })
        }
      },
      getters: {
        getState: (state: IState) => {
          return (id: string): State => state[id as keyof IState]
        }
      }
    })
  }
}
