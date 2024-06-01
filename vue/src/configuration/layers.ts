import { Layer, Url } from '@/enums'

const mvtBaseURL: string = Url.MVT_BASE_URL,
  biosphereLayer: string = Layer.BIOSPHERE,
  trailsLayer: string = Layer.TRAILS

export default [
  {
    id: 'biosphere',
    type: 'fill',
    source: {
      type: 'vector',
      url: `${mvtBaseURL}/${biosphereLayer}`
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
      url: `${mvtBaseURL}/${biosphereLayer}`
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
      url: `${mvtBaseURL}/${trailsLayer}`
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
