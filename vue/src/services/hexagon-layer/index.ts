/*
 * Example URL: https://deck.gl/gallery/hexagon-layer
 * Data URL: https://raw.githubusercontent.com/visgl/deck.gl-data/master/examples/3d-heatmap/heatmap-data.csv
 * Data Source: https://data.gov.uk
 */
import { HexagonLayer } from '@deck.gl/aggregation-layers'
import { Container, Service } from 'typedi'

import { hexagonLayer } from '@/configuration'
import { State } from '@/enums'
import { IHexagonLayerProp, IHexagonLayerState, IHexagonLayerStateProp } from '@/interfaces'
import { DeckglService, HexagonLayerDataService, StoreService } from '@/services'
import { HexagonLayerData } from '@/types'

@Service()
export default class HexagonLayerService {
  #hexagonLayerDataService = Container.get(HexagonLayerDataService)
  #storeService = Container.get(StoreService)

  #hexagonLayerData: HexagonLayerData = []
  #hexagonLayerInitialState: IHexagonLayerState = hexagonLayer.state
  #hexagonLayerProps: IHexagonLayerProp = hexagonLayer.props

  get hexagonLayerState() {
    return <IHexagonLayerState>this.#storeService.getState(State.HEXAGON_LAYER)
  }

  set #hexagonLayerState(state: IHexagonLayerState) {
    this.#storeService.setState(State.HEXAGON_LAYER, state)
  }

  /* eslint-disable */
  renderHexagonLayer(): void {
    !this.#hexagonLayerData.length && this.#setHexagonLayerData()
    const deckglService = Container.get(DeckglService),
      { deck } = deckglService,
      hexagonLayer = new HexagonLayer({
        data: this.#hexagonLayerData,
        getPosition: (d: number[]): number[] => d,
        ...this.#hexagonLayerProps,
        ...this.hexagonLayerState
      })
    deck.setProps({ layers: [hexagonLayer] })
  }
  /* eslint-enable */

  setHexagonLayerState({ id, value }: IHexagonLayerStateProp): void {
    const state = <IHexagonLayerState>{ ...this.hexagonLayerState }
    state[id as keyof IHexagonLayerState] = Number(value)
    this.#hexagonLayerState = state
  }

  resetHexagonLayerState(): void {
    this.#hexagonLayerState = this.#hexagonLayerInitialState
  }

  #setHexagonLayerData(): void {
    const { hexagonLayerData } = this.#hexagonLayerDataService
    this.#hexagonLayerData = hexagonLayerData
  }
}
