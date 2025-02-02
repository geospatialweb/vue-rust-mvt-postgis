import { Route } from '@/enums'
import { Authentication, Deckgl, Mapbox, PageNotFound, Registration } from '@/views'

const baseURL = import.meta.env.BASE_URL

export default {
  activeMapboxStyle: 'outdoors',
  appState: {
    initialZoom: undefined,
    isMobile: false
  },
  credentials: {
    isCorrect: true,
    isValid: true,
    password: 'secretPassword',
    role: 'user',
    username: 'foo@bar.com'
  },
  features: [
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [[-76.011422, 44.384362]]
      },
      properties: {
        name: 'Frontenac Arch Biosphere Office',
        description: '19 Reynolds Road, Lansdowne, ON. Open Monday to Friday 8:30am - 4:30pm'
      }
    }
  ],
  geoJsonParams: {
    columns: 'name,description,geom',
    table: 'office'
  },
  hexagonLayerData: [],
  hexagonLayerState: {
    coverage: 1,
    elevationScale: 100,
    radius: 1000,
    upperPercentile: 100
  },
  initialZoom: 10,
  initialZoomFactor: 0.9,
  layerControllerIcons: [
    {
      id: 'satellite',
      name: 'Satellite',
      src: '/assets/icons/satellite.webp',
      height: '20',
      width: '20'
    },
    {
      id: 'biosphere',
      name: 'Biosphere',
      src: '/assets/icons/biosphere.webp',
      height: '16',
      width: '16'
    },
    {
      id: 'office',
      name: 'Office',
      src: '/assets/icons/office.webp',
      height: '20',
      width: '18'
    },
    {
      id: 'places',
      name: 'Places',
      src: '/assets/icons/places.webp',
      height: '20',
      width: '18'
    },
    {
      id: 'trails',
      name: 'Trails',
      src: '/assets/icons/trails.webp',
      height: '20',
      width: '18'
    },
    {
      id: 'deckgl',
      name: 'Deck.GL',
      src: '/assets/icons/deckgl.webp',
      height: '18',
      width: '18'
    }
  ],
  layerControllerLayers: [
    {
      id: 'satellite',
      name: 'Satellite',
      className: 'inactive',
      isActive: false
    },
    {
      id: 'biosphere',
      name: 'Biosphere',
      className: 'active',
      isActive: true
    },
    {
      id: 'office',
      name: 'Office',
      className: 'inactive',
      isActive: false
    },
    {
      id: 'places',
      name: 'Places',
      className: 'inactive',
      isActive: false
    },
    {
      id: 'trails',
      name: 'Trails',
      className: 'inactive',
      isActive: false
    },
    {
      id: 'deckgl',
      name: 'Deck.GL',
      className: 'inactive',
      isActive: false
    }
  ],
  layerVisibility: {
    biosphere: {
      isActive: true
    },
    'biosphere-border': {
      isActive: true
    },
    trails: {
      isActive: false
    }
  },
  mapboxSettings: {
    bearing: 0,
    center: { lng: -76.25, lat: 44.5 },
    maxPitch: 75,
    maxZoom: 18,
    minZoom: 2,
    pitch: 0,
    style: 'mapbox://styles/mapbox/outdoors-v12',
    zoom: 7
  },
  mapboxStyles: {
    outdoors: {
      id: 'outdoors',
      isActive: true,
      url: 'mapbox://styles/mapbox/outdoors-v12'
    },
    satellite: {
      id: 'satellite',
      isActive: false,
      url: 'mapbox://styles/mapbox/satellite-v9'
    }
  },
  marker: {
    type: 'Feature',
    geometry: {
      type: 'Point',
      coordinates: [-76.011422, 44.384362]
    },
    properties: {
      name: 'Frontenac Arch Biosphere Office',
      description: '19 Reynolds Road, Lansdowne, ON. Open Monday to Friday 8:30am - 4:30pm'
    }
  },
  markersHashmap: [
    {
      key: 'office',
      value: 0
    },
    {
      key: 'places',
      value: 1
    },
    {
      key: 'trails',
      value: 2
    }
  ],
  markersReverseHashmap: [
    {
      key: 0,
      value: 'office'
    },
    {
      key: 1,
      value: 'places'
    },
    {
      key: 2,
      value: 'trails'
    }
  ],
  modalState: {
    isActive: false
  },
  routes: [
    {
      path: baseURL,
      redirect: Route.Login
    },
    {
      path: `${baseURL}${Route.Login}`,
      name: Route.Login,
      component: Authentication
    },
    {
      path: `${baseURL}${Route.Register}`,
      name: Route.Register,
      component: Registration
    },
    {
      path: `${baseURL}${Route.Deckgl}`,
      name: Route.Deckgl,
      component: Deckgl
    },
    {
      path: `${baseURL}${Route.Mapbox}`,
      name: Route.Mapbox,
      component: Mapbox
    },
    {
      path: `${baseURL}:pathMatch(.*)*`,
      name: Route.PageNotFound,
      component: PageNotFound
    }
  ],
  sliderLabelsState: {
    coverage: false,
    elevationScale: false,
    radius: false,
    upperPercentile: false
  },
  sliderValues: ['0.5', '0', '5000', '80'],
  store: {
    id: 'modal',
    state: {
      isActive: false
    }
  },
  trailParams: {
    name: 'Blue Mountain',
    center: [-76.04, 44.508],
    zoom: 10
  }
}
