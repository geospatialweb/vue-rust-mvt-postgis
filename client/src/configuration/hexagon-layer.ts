export default {
  reactiveProps: {
    coverage: 1,
    elevationScale: 100,
    radius: 1000,
    upperPercentile: 100
  },
  staticProps: {
    id: 'hexagon-layer',
    colorRange: [
      [1, 152, 189],
      [73, 227, 206],
      [216, 254, 181],
      [254, 237, 177],
      [254, 173, 84],
      [209, 55, 78]
    ],
    elevationRange: [0, 3000],
    extruded: true,
    material: {
      ambient: 0.6,
      diffuse: 0.6,
      shininess: 40,
      specularColor: [50, 50, 50]
    },
    pickable: true,
    transitions: {
      coverage: 1000,
      elevationScale: 1000
    }
  }
}
