import { Feature, FeatureCollection, GeoJsonProperties, Geometry, Point } from 'geojson'
import { LngLat, LngLatLike, Marker } from 'mapbox-gl'
import { Container, Service } from 'typedi'

import { markerParams } from '@/configuration'
import { State } from '@/enums'
import { IMarkerVisibilityState, IQueryParam } from '@/interfaces'
import { ApiService, AuthorizationService, MapboxService, PopupService, StoreService } from '@/services'

@Service()
export default class MarkerService {
  #apiService = Container.get(ApiService)
  #authorizationService = Container.get(AuthorizationService)
  #popupService = Container.get(PopupService)
  #storeService = Container.get(StoreService)

  #markerParams: IQueryParam[] = markerParams
  #markers: Marker[][] = []
  #markersHashmap: Map<string, number> = new Map()
  #reverseMarkersHashmap: Map<number, string> = new Map()

  get #markerVisibilityState() {
    return <IMarkerVisibilityState>this.#storeService.getState(State.MARKER_VISIBILITY)
  }

  set #markerVisibilityState(state: IMarkerVisibilityState) {
    this.#storeService.setState(State.MARKER_VISIBILITY, state)
  }

  async setMarkerFeatures(): Promise<void> {
    const jwtToken = this.#getJwtToken()
    for (const params of this.#markerParams) {
      const { id } = params,
        { features } = await this.#getMarkerFeatureCollection(jwtToken, params)
      features?.length ? this.#setMarkers(id, features) : this.#consoleError(`No ${id.toUpperCase()} Features Found`)
    }
  }

  setHiddenMarkersVisibility(): void {
    for (const [idx, markers] of this.#markers.entries()) {
      const id = <string>this.#reverseMarkersHashmap.get(idx),
        { isActive } = this.#markerVisibilityState[id as keyof IMarkerVisibilityState]
      isActive && this.#setHiddenMarkers(id, markers)
    }
  }

  toggleMarkerVisibility(id: string): void {
    this.#setMarkerVisibilityState(id)
    for (const marker of this.#markers[<number>this.#markersHashmap.get(id)]) {
      this.#addRemoveMarkers(id, marker)
    }
  }

  #getJwtToken(): string {
    /* prettier-ignore */
    const { jwtState: { jwtToken } } = this.#authorizationService
    return jwtToken
  }

  async #getMarkerFeatureCollection(jwtToken: string, params: IQueryParam): Promise<FeatureCollection> {
    return this.#apiService.getGeoJSONFeatureCollection(jwtToken, params)
  }

  #setMarkers(id: string, features: Feature<Geometry, GeoJsonProperties>[]): void {
    if (!features?.length) return this.#consoleError(`no ${this.#setMarkers.name.slice(4)} features found`)
    this.#markers = [...this.#markers, this.#createMarkers(id, features)]
    this.#setMarkersHashmaps(id)
  }

  #createMarkers(id: string, features: Feature<Geometry, GeoJsonProperties>[]): Marker[] {
    const marker = (feature: Feature): Marker => {
      const el = this.#createMarkerElement(id, feature)
      return this.#createMarker(el, feature)
    }
    return features.map(marker)
  }

  #createMarkerElement(id: string, feature: Feature): HTMLDivElement {
    const el = document.createElement('div')
    el.className = id
    el.addEventListener('mouseenter', (): void => this.#popupService.addMarkerPopup(feature), { passive: true })
    el.addEventListener('touchstart', (): void => this.#popupService.addMarkerPopup(feature), { passive: true })
    el.addEventListener('mouseleave', (): void => this.#popupService.removePopup(), { passive: true })
    el.addEventListener('touchend', (): void => this.#popupService.removePopup(), { passive: true })
    return el
  }

  #createMarker(el: HTMLDivElement, { geometry, properties }: Feature): Marker {
    if (properties && Reflect.ownKeys(properties)?.length) {
      const { lng, lat } = <LngLat>properties
      if (lng && lat) return new Marker(el).setLngLat([lng, lat])
    }
    return new Marker(el).setLngLat(<LngLatLike>(<Point>geometry).coordinates)
  }

  #setMarkersHashmaps(id: string): void {
    const idx = this.#markers.length - 1
    this.#markersHashmap.set(id, idx)
    this.#reverseMarkersHashmap.set(idx, id)
  }

  #setMarkerVisibilityState(id: string): void {
    const state = <IMarkerVisibilityState>{ ...this.#markerVisibilityState }
    state[id as keyof IMarkerVisibilityState].isActive = !state[id as keyof IMarkerVisibilityState].isActive
    this.#markerVisibilityState = state
  }

  #setHiddenMarkers(id: string, markers: Marker[]): void {
    this.#setHiddenMarkerVisibilityState(id)
    for (const marker of markers) {
      this.#addRemoveHiddenMarkers(id, marker)
    }
  }

  #setHiddenMarkerVisibilityState(id: string): void {
    const state = <IMarkerVisibilityState>{ ...this.#markerVisibilityState }
    state[id as keyof IMarkerVisibilityState].isHidden = !state[id as keyof IMarkerVisibilityState].isHidden
    this.#markerVisibilityState = state
  }

  #addRemoveMarkers(id: string, marker: Marker): void {
    this.#markerVisibilityState[id as keyof IMarkerVisibilityState].isActive
      ? this.#addMarker(marker)
      : this.#removeMarker(marker)
  }

  #addRemoveHiddenMarkers(id: string, marker: Marker): void {
    this.#markerVisibilityState[id as keyof IMarkerVisibilityState].isHidden
      ? this.#removeMarker(marker)
      : this.#addMarker(marker)
  }

  #addMarker(marker: Marker): void {
    const mapboxService = Container.get(MapboxService),
      { map } = mapboxService
    marker.addTo(map)
  }

  #removeMarker(marker: Marker): void {
    marker && marker.remove()
  }

  #consoleError(msg: string): void {
    import.meta.env.DEV && console.error(msg)
  }
}
