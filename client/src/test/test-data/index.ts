import { Authentication, Deck, Mapbox, PageNotFound, Registration } from '@/views'

const baseURL = import.meta.env.BASE_URL

export default {
  credentials: {
    password: 'Click_Login',
    username: 'johncampbell@geospatialweb.ca'
  },
  initialZoom: 10,
  initialZoomFactor: 0.9,
  jwt: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhZG1pbiI6dHJ1ZSwiYXVkIjoiZ2Vvc3BhdGlhbHdlYi5jYSIsImV4cCI6MTY4MDgwNzg3NCwiaXNzIjoiZ2Vvc3BhdGlhbHdlYi5jYSIsIm5hbWUiOiJqb2huY2FtcGJlbGxAZ2Vvc3BhdGlhbHdlYi5jYSIsInN1YiI6IjEifQ.1zNsIABBvgKvm2F4Z_Gf78f-MgoPqJcuFQKU_fhbZz8',
  jwtExpiry: 1681334027,
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
  layerElements: [
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
      redirect: 'login'
    },
    {
      path: `${baseURL}login`,
      name: 'login',
      component: Authentication
    },
    {
      path: `${baseURL}register`,
      name: 'register',
      component: Registration
    },
    {
      path: `${baseURL}deckgl`,
      name: 'deckgl',
      component: Deck
    },
    {
      path: `${baseURL}mapbox`,
      name: 'mapbox',
      component: Mapbox
    },
    {
      path: `${baseURL}:pathMatch(.*)*`,
      name: '404',
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
