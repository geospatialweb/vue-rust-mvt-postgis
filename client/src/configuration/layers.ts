import { Url } from '@/enums'
import { IUrl } from '@/interfaces'

const { MVT_BASE_URL_DEV }: IUrl = Url

export default [
  {
    id: 'biosphere',
    type: 'fill',
    source: {
      type: 'vector',
      url: `${MVT_BASE_URL_DEV}/biosphere`
    },
    'source-layer': 'biosphere',
    layout: {
      visibility: 'none'
    },
    paint: {
      'fill-color': '#0A0',
      'fill-opacity': 0.4,
      'fill-outline-color': '#000'
    }
  },
  {
    id: 'biosphere-border',
    type: 'line',
    source: {
      type: 'vector',
      url: `${MVT_BASE_URL_DEV}/biosphere`
    },
    'source-layer': 'biosphere',
    layout: {
      visibility: 'none'
    },
    paint: {
      'line-color': '#000',
      'line-width': 1.5
    }
  },
  {
    id: 'trails',
    type: 'line',
    source: {
      type: 'vector',
      url: `${MVT_BASE_URL_DEV}/trails`
    },
    'source-layer': 'trails',
    layout: {
      visibility: 'none'
    },
    paint: {
      'line-color': '#900',
      'line-width': 3
    }
  }
]
