import cloneDeep from 'lodash.clonedeep'
import { defineStore } from 'pinia'
import { Service } from 'typedi'

import {
  app,
  credentials,
  deckgl,
  hexagonLayer,
  hexagonUILabelElement,
  jwt,
  layerElements,
  layerVisibility,
  mapbox,
  markerVisibility,
  modal
} from '@/configuration'
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
import { StoreState, UseStoreDefinition } from '@/types'

@Service()
export default class StoreService {
  #app: IApp = { ...app }
  #credentials: ICredential = { ...credentials }
  #deckglSettings: IDeckglSetting = { ...deckgl.settings }
  #hexagonLayerProps: IHexagonLayerProp = { ...hexagonLayer.reactiveProps }
  #hexagonUILabelElement: IHexagonUILabelElement = { ...hexagonUILabelElement }
  #JWT: IJWT = { ...jwt }
  #layerElements: ILayerElement[] = cloneDeep(layerElements)
  #layerVisibility: ILayerVisibility = cloneDeep(layerVisibility)
  #mapboxSettings: IMapboxSetting = { ...mapbox.settings }
  #mapboxStyles: IMapboxStyle = cloneDeep(mapbox.styles)
  #markerVisibility: IMarkerVisibility = cloneDeep(markerVisibility)
  #modal: IModal = { ...modal }
  #useStore: UseStoreDefinition = defineStore('store', {})

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
    this.#useStore = defineStore('store', {
      state: (): IStoreState => ({
        app: this.#app,
        credentials: this.#credentials,
        deckglSettings: this.#deckglSettings,
        hexagonLayerProps: this.#hexagonLayerProps,
        hexagonUILabelElement: this.#hexagonUILabelElement,
        JWT: this.#JWT,
        layerElements: this.#layerElements,
        layerVisibility: this.#layerVisibility,
        mapboxSettings: this.#mapboxSettings,
        mapboxStyles: this.#mapboxStyles,
        markerVisibility: this.#markerVisibility,
        modal: this.#modal
      }),
      actions: {
        setState(id: string, state: StoreState): void {
          this.$patch({ [id]: cloneDeep(state) })
        }
      },
      getters: {
        getState: (state: IStoreState) => {
          return (id: string): StoreState => <StoreState>cloneDeep(state[id as keyof IStoreState])
        }
      }
    })
  }
}
