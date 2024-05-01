/*
 * Example URL: https://deck.gl/gallery/hexagon-layer
 * Data URL: https://raw.githubusercontent.com/visgl/deck.gl-data/master/examples/3d-heatmap/heatmap-data.csv
 * Data Source: https://data.gov.uk
 */
import { HexagonLayer } from '@deck.gl/aggregation-layers'
import { Container, Service } from 'typedi'

import { hexagonLayer } from '@/configuration'
import { StoreState } from '@/enums'
import { IHexagonLayerProp, IHexagonLayerPropState, IHexagonLayerStaticProp } from '@/interfaces'
import { DeckglService, HexagonLayerDataService, StoreService } from '@/services'
import { HexagonLayerData } from '@/types'

@Service()
export default class HexagonLayerService {
  #hexagonLayerDataService = Container.get(HexagonLayerDataService)
  #storeService = Container.get(StoreService)

  #hexagonLayerData: HexagonLayerData = []
  #hexagonLayerPropsStoreState: string = StoreState.HEXAGON_LAYER_PROPS
  #reactiveProps: IHexagonLayerProp = { ...hexagonLayer.reactiveProps }
  #staticProps: IHexagonLayerStaticProp = hexagonLayer.staticProps

  get hexagonLayerPropsState() {
    return <IHexagonLayerProp>this.#storeService.getStoreState(this.#hexagonLayerPropsStoreState)
  }

  set #hexagonLayerPropsState(state: IHexagonLayerProp) {
    this.#storeService.setStoreState(this.#hexagonLayerPropsStoreState, state)
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
