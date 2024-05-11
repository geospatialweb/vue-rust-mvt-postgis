export default {
  navigationControl: {
    position: 'top-left',
    visualizePitch: true
  },
  options: {
    container: 'mapbox',
    doubleClickZoom: false
  },
  settings: {
    bearing: 0,
    center: { lng: -76.25, lat: 44.5 },
    maxPitch: 75,
    maxZoom: 18,
    minZoom: 2,
    pitch: 0,
    style: 'mapbox://styles/mapbox/outdoors-v12',
    zoom: 7
  },
  skyLayer: {
    id: 'sky',
    type: 'sky',
    paint: {
      'sky-type': 'atmosphere',
      'sky-atmosphere-sun': [0.0, 0.0],
      'sky-atmosphere-sun-intensity': 25
    }
  },
  styles: {
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
  }
}
