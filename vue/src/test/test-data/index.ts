import { Route } from '@/enums'
import { Authentication, Deckgl, Mapbox, PageNotFound, Registration } from '@/views'

const baseURL = import.meta.env.BASE_URL

export default {
  credentials: {
    password: 'Click_Login',
    username: 'johncampbell@geospatialweb.ca'
  },
  hexagonLayerControllerSliderLabelsState: {
    coverage: false,
    elevationScale: false,
    radius: false,
    upperPercentile: false
  },
  hexagonLayerState: {
    coverage: 1,
    elevationScale: 100,
    radius: 1000,
    upperPercentile: 100
  },
  initialZoom: 10,
  initialZoomFactor: 0.9,
  jwtExpiry: 1681334027,
  jwtToken:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbiI6dHJ1ZSwiYXVkIjoiZ2Vvc3BhdGlhbHdlYi5jYSIsImV4cCI6MTY4MDgwNzg3NCwiaXNzIjoiZ2Vvc3BhdGlhbHdlYi5jYSIsIm5hbWUiOiJqb2huY2FtcGJlbGxAZ2Vvc3BhdGlhbHdlYi5jYSIsInN1YiI6IjEifQ.1zNsIABBvgKvm2F4Z_Gf78f-MgoPqJcuFQKU_fhbZz8',
  layer: {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [-76.205278, 44.297778],
              [-75.903611, 44.380833],
              [-75.825278, 44.430833],
              [-75.809444, 44.478611],
              [-75.653333, 44.599167],
              [-75.676389, 44.614722],
              [-75.851389, 44.648056],
              [-76.086944, 44.633611],
              [-76.203889, 44.660278],
              [-76.331667, 44.668611],
              [-76.545278, 44.773056],
              [-76.674444, 44.716944],
              [-76.706389, 44.504444],
              [-76.880278, 44.492222],
              [-76.760556, 44.326389],
              [-76.425556, 44.347778],
              [-76.213611, 44.483333],
              [-76.205278, 44.297778]
            ]
          ]
        },
        properties: {
          name: 'Frontenac Arch Biosphere',
          description:
            'The Frontenac Arch is the ancient granite bridge from the Canadian Shield to the Adirondack Mountains Its incredibly rich natural environment and history was recognized in 2002 when it became a UNESCO World Biosphere Reserve.'
        }
      }
    ]
  },
  layerControllerIcons: [
    {
      id: 'satellite',
      name: 'Satellite',
      src: '/assets/icons/satellite.png',
      height: '20',
      width: '20'
    },
    {
      id: 'biosphere',
      name: 'Biosphere',
      src: '/assets/icons/biosphere.png',
      height: '16',
      width: '16'
    },
    {
      id: 'office',
      name: 'Office',
      src: '/assets/icons/office.png',
      height: '20',
      width: '18'
    },
    {
      id: 'places',
      name: 'Places',
      src: '/assets/icons/places.png',
      height: '20',
      width: '18'
    },
    {
      id: 'trails',
      name: 'Trails',
      src: '/assets/icons/trails.png',
      height: '20',
      width: '18'
    },
    {
      id: 'deckgl',
      name: 'Deck.GL',
      src: '/assets/icons/deckgl.png',
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
  queryParams: {
    columns: 'name,description,geom',
    id: 'biosphere'
  },
  requestBody: {
    password: 'foobar',
    username: 'foo@bar.com'
  },
  routes: [
    {
      path: baseURL,
      redirect: Route.LOGIN
    },
    {
      path: `${baseURL}${Route.LOGIN}`,
      name: Route.LOGIN,
      component: Authentication
    },
    {
      path: `${baseURL}${Route.REGISTER}`,
      name: Route.REGISTER,
      component: Registration
    },
    {
      path: `${baseURL}${Route.DECKGL}`,
      name: Route.DECKGL,
      component: Deckgl
    },
    {
      path: `${baseURL}${Route.MAPBOX}`,
      name: Route.MAPBOX,
      component: Mapbox
    },
    {
      path: `${baseURL}:pathMatch(.*)*`,
      name: Route.PAGE_NOT_FOUND,
      component: PageNotFound
    }
  ],
  sliderValues: ['0.5', '0', '5000', '80'],
  store: {
    id: 'MODAL',
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
