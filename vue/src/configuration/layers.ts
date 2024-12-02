import { Layer, URL } from '@/enums'

export default [
  {
    id: Layer.Biosphere,
    type: 'fill',
    source: {
      type: 'vector',
      url: `${URL.MvtBaseUrl}/${Layer.Biosphere}`
    },
    'source-layer': Layer.Biosphere,
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
    id: Layer.BiosphereBorder,
    type: 'line',
    source: {
      type: 'vector',
      url: `${URL.MvtBaseUrl}/${Layer.Biosphere}`
    },
    'source-layer': Layer.Biosphere,
    layout: {
      visibility: 'none'
    },
    paint: {
      'line-color': '#000',
      'line-width': 1.5
    }
  },
  {
    id: Layer.Trails,
    type: 'line',
    source: {
      type: 'vector',
      url: `${URL.MvtBaseUrl}/${Layer.Trails}`
    },
    'source-layer': Layer.Trails,
    layout: {
      visibility: 'none'
    },
    paint: {
      'line-color': '#900',
      'line-width': 3
    }
  }
]
