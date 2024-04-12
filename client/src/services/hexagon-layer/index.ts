/*
 * Example URL: https://deck.gl/gallery/hexagon-layer
 * Data URL: https://raw.githubusercontent.com/visgl/deck.gl-data/master/examples/3d-heatmap/heatmap-data.csv
 * Data Source: https://data.gov.uk
 */
import { HexagonLayer } from '@deck.gl/aggregation-layers'
import { Container, Service } from 'typedi'

import { hexagonLayer } from '@/configuration'
import { StoreStates } from '@/enums'
import { IHexagonLayerProp, IHexagonLayerPropState, IHexagonLayerStaticProp, IStoreStates } from '@/interfaces'
import { DeckglService, HexagonLayerDataService, StoreService } from '@/services'
import { HexagonLayerData } from '@/types'

@Service()
export default class HexagonLayerService {
  #hexagonLayerDataService = Container.get(HexagonLayerDataService)
  #storeService = Container.get(StoreService)
  #hexagonLayerData: HexagonLayerData = []
  #reactiveProps: IHexagonLayerProp = { ...hexagonLayer.reactiveProps }
  #staticProps: IHexagonLayerStaticProp = hexagonLayer.staticProps
  #storeStates: IStoreStates = StoreStates

  get hexagonLayerPropsState() {
    return <IHexagonLayerProp>this.#storeService.getStoreState(this.#storeStates.HEXAGON_LAYER_PROPS)
  }

  set #hexagonLayerPropsState(state: IHexagonLayerProp) {
    this.#storeService.setStoreState(this.#storeStates.HEXAGON_LAYER_PROPS, state)
  }

  setHexagonLayerPropsState({ id, value }: IHexagonLayerPropState): void {
    const state: IHexagonLayerProp = { ...this.hexagonLayerPropsState }
    state[id as keyof IHexagonLayerProp] = Number(value)
    this.#hexagonLayerPropsState = state
  }

  resetHexagonLayerPropsState(): void {
    this.#hexagonLayerPropsState = this.#reactiveProps
  }

  #setHexagonLayerData(): void {
    const { hexagonLayerData } = this.#hexagonLayerDataService
    this.#hexagonLayerData = hexagonLayerData
  }
  /* eslint-disable */
  renderHexagonLayer(): void {
    !this.#hexagonLayerData.length && this.#setHexagonLayerData()
    const deckglService = Container.get(DeckglService),
      { deck } = deckglService,
      hexagonLayer = new HexagonLayer({
        data: this.#hexagonLayerData,
        getPosition: (d: number[]): number[] => d,
        ...this.#staticProps,
        ...this.hexagonLayerPropsState
      })
    deck.setProps({ layers: [hexagonLayer] })
  }
}
