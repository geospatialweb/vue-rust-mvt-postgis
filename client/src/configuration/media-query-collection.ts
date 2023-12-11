/*
 * Reference: "Viewport Size for Devices": https://yesviz.com/viewport/
 */
export default {
  // iPhone 5 / SE // LG K20 (2019)
  '(max-width: 320px) and (max-height: 640px)': {
    deckgl: 4.3,
    mapbox: 6.9,
    trail: 0.8
  },
  // iPhone SE (2020/2022) / 6 / 7 / 8 / 12 Mini / 13 Mini // Huawei P / Mate / Nova // Sony Xperia X / XZ / Z2 / Z3 / Z5
  // BB // HTC // LG // Samsung S5 / S6 / S7 / S8 / S8+ / S9 / S9+ / S10 / S20 // Samsung Note 3 / 4 / 8 / 9
  '(max-width: 392px) and (max-height: 800px)': {
    deckgl: 4.4,
    mapbox: 7.1,
    trail: 0.85
  },
  // iPhone 6+ / 7+ / 8+ / X / XR / XS Max / 11 / 11 Pro / 11 Pro Max / 12 / 12 Pro / 12 Pro Max / 13 / 13 Pro / 13 Pro Max / 14 / 14 Plus / 14 Pro / 14 Pro Max / 15 / 15 Plus / 15 Pro / 15 Pro Max
  // Samsung S10 Lite / S10+ / S20+ / S20 Ultra / S21 Ultra 5G / Z Flip // Samsung Note 10 / 10+ / 20 / 20 Ultra
  // OnePlus 6 / 6T / 7 / 7 Pro / 7T / 7T Pro / 8 / 8 Pro / 8T / 9 / 9 Pro / Nord // Sony Xperia 1 / 5 / 10 / 10+ / L4
  // Google Pixel / XL / 2 / 2XL / 3 / 3a / 3XL / 4 / 4a / 4XL / 5 / 6 / 6 Pro / 7 / 7 Pro / 8 / 8 Pro
  '(max-width: 430px) and (max-height: 1024px)': {
    deckgl: 4.7,
    mapbox: 7.3,
    trail: 0.85
  },
  // iPhone 5 / SE // LG K20 (2019)
  '(max-width: 640px) and (max-height: 320px)': {
    deckgl: 4.2,
    mapbox: 7.1,
    trail: 0.8
  },
  // Surface Duo / Duo 2
  '(max-width: 600px) and (max-height: 760px)': {
    deckgl: 5.0,
    mapbox: 7.5,
    trail: 0.9
  },
  // LG G Pad 5 10.1" // Samsung Galaxy Tab S6 Lite // Sony Xperia C4 / Z Ultra
  '(max-width: 600px) and (max-height: 960px)': {
    deckgl: 5.1,
    mapbox: 7.7,
    trail: 0.9
  },
  // iPhone SE (2020/2022) / 6 / 7 / 8 / 12 Mini / 13 Mini // Huawei P / Mate / Nova // Sony Xperia X / XZ / Z2 / Z3 / Z5
  // BB // HTC // LG // Samsung S5 / S6 / S7 / S8 / S8+ / S9 / S9+ / S10 / S20 // Samsung Note 3 / 4 / 8 / 9
  '(max-width: 800px) and (max-height: 392px)': {
    deckgl: 4.4,
    mapbox: 7.4,
    trail: 0.85
  },
  // iPhone 6+ / 7+ / 8+ / X / XR / XS Max / 11 / 11 Pro / 11 Pro Max / 12 / 12 Pro / 12 Pro Max / 13 / 13 Pro / 13 Pro Max / 14 / 14 Plus / 14 Pro / 14 Pro Max / 15 / 15 Plus / 15 Pro / 15 Pro Max
  // Samsung S10 Lite / S10+ / S20+ / S20 Ultra / S21 Ultra 5G / Z Flip // Samsung Note 10 / 10+ / 20 / 20 Ultra
  // OnePlus 6 / 6T / 7 / 7 Pro / 7T / 7T Pro / 8 / 8 Pro / 8T / 9 / 9 Pro / Nord // Sony Xperia 1 / 5 / 10 / 10+ / L4
  // Google Pixel / XL / 2 / 2XL / 3 / 3a / 3XL / 4 / 4a / 4XL / 5 / 6 / 6 Pro / 7 / 7 Pro / 8 / 8 Pro
  '(max-width: 1024px) and (max-height: 430px)': {
    deckgl: 4.6,
    mapbox: 7.7,
    trail: 0.85
  },
  // Surface Duo / Duo 2
  '(max-width: 760px) and (max-height: 600px)': {
    deckgl: 5.0,
    mapbox: 7.6,
    trail: 0.9
  },
  // iPad 10.2" / iPad Mini // Samsung Fold / Z Fold 2
  '(max-width: 884px) and (max-height: 1104px)': {
    deckgl: 5.5,
    mapbox: 8.0,
    trail: 0.9
  },
  // MacBook Pro 13.3" / Air 13.3" // iPad Pro 11" / Air / Air (2020)
  // Surface Pro / Pro 2 // Surface 2 / 3
  // Samsung Galaxy Tab S2 / S3 / S4 / S5e / S6 / S7 // Huawei MatePad Pro
  '(max-width: 884px) and (max-height: 1280px)': {
    deckgl: 5.6,
    mapbox: 8.1,
    trail: 0.9
  },
  // LG G Pad 5 10.1" // Samsung Galaxy Tab S6 Lite // Sony Xperia C4 / Z Ultra
  '(max-width: 960px) and (max-height: 600px)': {
    deckgl: 5.1,
    mapbox: 7.9,
    trail: 0.9
  },
  // iPad 10.2" / iPad Mini // Samsung Fold / Z Fold 2
  '(max-width: 1104px) and (max-height: 884px)': {
    deckgl: 5.6,
    mapbox: 8.2,
    trail: 0.9
  },
  // MacBook Pro / iPad Pro 12.9"
  // Surface Pro 3 / 4 / 5 / 6 / 7 / X
  // Samsung Galaxy Tab S7+
  '(max-width: 1024px) and (max-height: 1440px)': {
    deckgl: 5.7,
    mapbox: 8.3,
    trail: 0.95
  },
  // MacBook Pro 16"
  // Surface Laptop / Laptop 3 13.5" // Surface Book / Book 3 13.5"
  '(max-width: 1024px) and (max-height: 1536px)': {
    deckgl: 5.9,
    mapbox: 8.5,
    trail: 0.95
  },
  // Surface Laptop 3 15" // Surface Book 3 15"
  '(max-width: 1110px) and (max-height: 1680px)': {
    deckgl: 6.0,
    mapbox: 8.5,
    trail: 0.95
  },
  // MacBook Pro 13.3" / Air 13.3" // iPad Pro 11" / Air / Air (2020)
  // Surface Pro / Pro 2 // Surface 2 / 3
  // Samsung Galaxy Tab S2 / S3 / S4 / S5e / S6 / S7 // Huawei MatePad Pro
  '(max-width: 1280px) and (max-height: 884px)': {
    deckgl: 5.6,
    mapbox: 8.3,
    trail: 0.9
  },
  // MacBook Pro / iPad Pro 12.9"
  // Surface Pro 3 / 4 / 5 / 6 / 7 / X
  // Samsung Galaxy Tab S7+
  '(max-width: 1440px) and (max-height: 1024px)': {
    deckgl: 5.8,
    mapbox: 8.5,
    trail: 0.95
  },
  // MacBook Pro 16"
  // Surface Laptop / Laptop 3 13.5" // Surface Book / Book 3 13.5"
  '(max-width: 1536px) and (max-height: 1024px)': {
    deckgl: 5.9,
    mapbox: 8.7,
    trail: 0.95
  },
  // Surface Laptop 3 15" // Surface Book 3 15"
  '(max-width: 1680px) and (max-height: 1110px)': {
    deckgl: 6.0,
    mapbox: 8.8,
    trail: 0.95
  },
  '(max-width: 1920px)': {
    deckgl: 6.1,
    mapbox: 9.0,
    trail: 0.95
  },
  '(max-width: 2560px)': {
    deckgl: 6.4,
    mapbox: 9.3,
    trail: 1.0
  },
  '(max-width: 3840px)': {
    deckgl: 6.5,
    mapbox: 9.5,
    trail: 1.0
  }
}
