/*
 * Example URL: https://deck.gl/gallery/hexagon-layer
 * Data URL: https://raw.githubusercontent.com/visgl/deck.gl-data/master/examples/3d-heatmap/heatmap-data.csv
 * Data Source: https://data.gov.uk
 */
import { HexagonLayer } from '@deck.gl/aggregation-layers'
import { Container, Service } from 'typedi'

import { hexagonLayer } from '@/configuration'
import { State } from '@/enums'
import { DeckglService, HexagonLayerDataService, StoreService } from '@/services'

import type { IHexagonLayerControllerSliderInput, IHexagonLayerProp, IHexagonLayerState } from '@/interfaces'
import type { HexagonLayerData } from '@/types'

@Service()
export default class HexagonLayerService {
  #hexagonLayerData = <HexagonLayerData>[]
  #hexagonLayerInitialState = <IHexagonLayerState>hexagonLayer.state
  #hexagonLayerProps = <IHexagonLayerProp>hexagonLayer.props

  get hexagonLayerState(): IHexagonLayerState {
    const { getState } = Container.get(StoreService)
    return <IHexagonLayerState>getState(State.HexagonLayer)
  }

  set #hexagonLayerState(state: IHexagonLayerState) {
    const { setState } = Container.get(StoreService)
    setState(State.HexagonLayer, state)
  }

  /* eslint-disable */
  renderHexagonLayer = async (): Promise<void> => {
    await this.#setHexagonLayerData()
    const { deck } = Container.get(DeckglService),
      hexagonLayer = new HexagonLayer({
        data: this.#hexagonLayerData,
        getPosition: (d: number[]): number[] => d,
        ...this.#hexagonLayerProps,
        ...this.hexagonLayerState
      })
    deck.setProps({ layers: [hexagonLayer] })
  }
  /* eslint-enable */

  setHexagonLayerState = ({ id, value }: IHexagonLayerControllerSliderInput): void => {
    const state = <IHexagonLayerState>{ ...this.hexagonLayerState }
    state[id as keyof IHexagonLayerState] = Number(value)
    this.#hexagonLayerState = state
  }

  resetHexagonLayerState = async (): Promise<void> => {
    this.#hexagonLayerState = this.#hexagonLayerInitialState
    await this.renderHexagonLayer()
  }

  async #setHexagonLayerData(): Promise<void> {
    if (!this.#hexagonLayerData?.length) {
      const { getHexagonLayerData } = Container.get(HexagonLayerDataService)
      this.#hexagonLayerData = await getHexagonLayerData()
    }
  }
}
