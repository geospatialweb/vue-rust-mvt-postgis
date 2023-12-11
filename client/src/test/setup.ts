import 'reflect-metadata'

window.matchMedia = (query) => ({
  matches: false,
  media: query,
  onchange: null,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  dispatchEvent: vi.fn()
})

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
window.URL.createObjectURL = (): any => {
  // Do nothing
  // Mock this function for mapbox-gl to work
}
