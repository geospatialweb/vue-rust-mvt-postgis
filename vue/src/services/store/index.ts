import cloneDeep from 'lodash.clonedeep'
import { defineStore } from 'pinia'
import { Service } from 'typedi'

import {
  app,
  credentials,
  deckgl,
  hexagonLayer,
  hexagonUILabel,
  jwt,
  layers,
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
  IHexagonUILabelState,
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
  #hexagonUILabel: IHexagonUILabelState = { ...hexagonUILabel }
  #jwt: IJWTState = { ...jwt }
  #layerController: ILayerControllerState[] = cloneDeep(layers)
  #layerVisibility: ILayerVisibilityState = cloneDeep(layerVisibility)
  #mapboxSettings: IMapboxSettingsState = { ...mapbox.settings }
  #mapboxStyles: IMapboxStylesState = cloneDeep(mapbox.styles)
  #markerVisibility: IMarkerVisibilityState = cloneDeep(markerVisibility)
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
        hexagonUILabel: this.#hexagonUILabel,
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
          this.$patch({ [id]: cloneDeep(state) })
        }
      },
      getters: {
        getState: (state: IState) => {
          return (id: string): State => cloneDeep(state[id as keyof IState])
        }
      }
    })
  }
}
