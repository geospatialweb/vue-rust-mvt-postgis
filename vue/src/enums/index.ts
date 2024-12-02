export enum ApiEndpoint {
  DeleteUser = '/api/deleteuser',
  Geojson = '/api/geojson',
  GetUser = '/api/getuser',
  MapboxAccessToken = '/api/mapbox-access-token',
  UpdatePassword = '/api/updatepassword'
}

export enum CredentialsEndpoint {
  Login = '/credentials/login',
  Register = '/credentials/register',
  ValidateUser = '/credentials/validateuser'
}

export enum Error {
  'undefined jwt' = 'undefined jwt'
}

export enum Layer {
  Biosphere = 'biosphere',
  BiosphereBorder = 'biosphere-border',
  Deckgl = 'deckgl',
  Office = 'office',
  Places = 'places',
  Satellite = 'satellite',
  Trails = 'trails'
}

export enum Route {
  Deckgl = 'deckgl',
  Login = 'login',
  Mapbox = 'mapbox',
  PageNotFound = 'pageNotFound',
  Register = 'register'
}

export enum State {
  App = 'app',
  Credentials = 'credentials',
  DeckglSettings = 'deckglSettings',
  HexagonLayer = 'hexagonLayer',
  HexagonLayerControllerSliderLabels = 'hexagonLayerControllerSliderLabels',
  Jwt = 'jwt',
  LayerController = 'layerController',
  LayerVisibility = 'layerVisibility',
  MapboxSettings = 'mapboxSettings',
  MapboxStyles = 'mapboxStyles',
  MarkerVisibility = 'markerVisibility',
  Modal = 'modal'
}

export enum Store {
  State = 'state'
}

export enum URL {
  ApiBaseUrlDev = 'http://localhost:8000',
  ApiBaseUrlProd = 'https://geospatialweb.ca:8000',
  HexagonLayerData = 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/examples/3d-heatmap/heatmap-data.csv',
  MvtBaseUrl = 'http://localhost:3000'
}
