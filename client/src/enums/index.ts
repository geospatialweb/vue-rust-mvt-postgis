export enum Endpoint {
  DELETE_USER_ENDPOINT = '/api/deleteuser',
  GEOJSON_ENDPOINT = '/api/geojson',
  GET_USER_ENDPOINT = '/api/getuser',
  MAPBOX_ACCESS_TOKEN_ENDPOINT = '/api/mapbox-access-token',
  UPDATE_PASSWORD_ENDPOINT = '/api/updatepassword',
  LOGIN_ENDPOINT = '/credentials/login',
  REGISTER_ENDPOINT = '/credentials/register',
  VALIDATE_USER_ENDPOINT = '/credentials/validateuser'
}

export enum LayerId {
  BIOSPHERE = 'biosphere',
  BIOSPHERE_BORDER = 'biosphere-border',
  DECKGL = 'deckgl',
  OFFICE = 'office',
  PLACES = 'places',
  SATELLITE = 'satellite',
  TRAILS = 'trails'
}

export enum StoreStates {
  APP = 'app',
  CREDENTIALS = 'credentials',
  DECKGL_SETTINGS = 'deckglSettings',
  HEXAGON_LAYER_PROPS = 'hexagonLayerProps',
  HEXAGON_UI_LAYER_ELEMENT = 'hexagonUILabelElement',
  JWT = 'JWT',
  LAYER_ELEMENTS = 'layerElements',
  LAYER_VISIBILITY = 'layerVisibility',
  MAPBOX_SETTINGS = 'mapboxSettings',
  MAPBOX_STYLES = 'mapboxStyles',
  MARKER_VISIBILITY = 'markerVisibility',
  MODAL = 'modal'
}

export enum Url {
  API_BASE_URL_DEV = 'http://localhost:8000',
  API_BASE_URL_PROD = 'https://geospatialweb.ca:8000',
  MVT_BASE_URL_DEV = 'http://localhost:3000',
  MVT_BASE_URL_PROD = 'https://geospatialweb.ca:3000',
  HEXAGON_LAYER_DATA_URL = 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/examples/3d-heatmap/heatmap-data.csv'
}
