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
  layerElements,
  layerVisibility,
  mapbox,
  markerVisibility,
  modal
} from '@/configuration'
import {
  IAppState,
  ICredentialState,
  IDeckglSettingState,
  IHexagonLayerState,
  IHexagonUILabelState,
  IJWTState,
  ILayerElementsState,
  ILayerVisibilityState,
  IMapboxSettingState,
  IMapboxStyleState,
  IMarkerVisibilityState,
  IModalState,
  IState
} from '@/interfaces'
import { State, UseStoreDefinition } from '@/types'

@Service()
export default class StoreService {
  #app: IAppState = { ...app }
  #credentials: ICredentialState = { ...credentials }
  #deckglSettings: IDeckglSettingState = { ...deckgl.settings }
  #hexagonLayer: IHexagonLayerState = { ...hexagonLayer.state }
  #hexagonUILabel: IHexagonUILabelState = { ...hexagonUILabel }
  #JWT: IJWTState = { ...jwt }
  #layerElements: ILayerElementsState[] = cloneDeep(layerElements)
  #layerVisibility: ILayerVisibilityState = cloneDeep(layerVisibility)
  #mapboxSettings: IMapboxSettingState = { ...mapbox.settings }
  #mapboxStyles: IMapboxStyleState = cloneDeep(mapbox.styles)
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
        JWT: this.#JWT,
        layerElements: this.#layerElements,
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
          return (id: string): State => <State>cloneDeep(state[id as keyof IState])
        }
      }
    })
  }
}
