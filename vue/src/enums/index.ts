export enum Axios {
  AcceptHeader = 'application/json',
  Timeout = '2000'
}

export enum Color {
  Red = '\x1b[31m%s\x1b[0m'
}

export enum Endpoint {
  DeleteUser = '/deleteuser',
  GetGeoJson = '/geojson',
  GetMapboxAccessToken = '/mapbox-access-token',
  GetUser = '/getuser',
  Login = '/login',
  Register = '/register',
  UpdatePassword = '/updatepassword',
  ValidateUser = '/validateuser'
}

export enum EndpointPrefix {
  Api = '/api',
  Credentials = '/credentials'
}

export enum Event {
  Click = 'click',
  DrawModeChange = 'draw.modechange',
  Idle = 'idle',
  Load = 'load',
  Mouseenter = 'mouseenter',
  Mouseleave = 'mouseleave',
  Touchend = 'touchend',
  Touchstart = 'touchstart'
}

export enum Header {
  Authorization = 'Authorization',
  Bearer = 'Bearer'
}

export enum HTTP {
  Forbidden = 403,
  Unauthorized = 401
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

export enum Role {
  Admin = 'admin',
  User = 'user'
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

export enum Visibility {
  None = 'none',
  Visibility = 'visibility',
  Visible = 'visible'
}
