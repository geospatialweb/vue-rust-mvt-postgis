import cloneDeep from 'lodash.clonedeep'
import { Feature, FeatureCollection, GeoJsonProperties, Geometry, Point } from 'geojson'
import { LngLat, LngLatLike, Marker } from 'mapbox-gl'
import { Container, Service } from 'typedi'

import { markerParams } from '@/configuration'
import { StoreStates } from '@/enums'
import { IMarkerVisibility, IQueryParam, IStoreStates } from '@/interfaces'
import { ApiService, MapboxService, PopupService, StoreService } from '@/services'

@Service()
export default class MarkerService {
  #apiService = Container.get(ApiService)
  #popupService = Container.get(PopupService)
  #storeService = Container.get(StoreService)
  #markerParams: IQueryParam[] = markerParams
  #markers: Marker[][] = []
  #markersHashmap: Map<string, number> = new Map()
  #reverseMarkersHashmap: Map<number, string> = new Map()
  #storeStates: IStoreStates = StoreStates

  get #markerVisibilityState(): IMarkerVisibility {
    return <IMarkerVisibility>this.#storeService.getState(this.#storeStates.MARKER_VISIBILITY)
  }

  set #markerVisibilityState(state: IMarkerVisibility) {
    this.#storeService.setState(this.#storeStates.MARKER_VISIBILITY, state)
  }

  setHiddenMarkersVisibility(): void {
    for (const [idx, markers] of this.#markers.entries()) {
      const id = <string>this.#reverseMarkersHashmap.get(idx),
        { isActive } = this.#markerVisibilityState[id as keyof IMarkerVisibility]
      isActive && this.#setHiddenMarkers(id, markers)
    }
  }

  toggleMarkerVisibility(id: string): void {
    this.#setMarkerVisibilityState(id)
    for (const marker of this.#markers[<number>this.#markersHashmap.get(id)]) {
      this.#addRemoveMarkers(id, marker)
    }
  }

  async setMarkerFeatures(token: string): Promise<void> {
    for (const params of this.#markerParams) {
      const { id } = params,
        { features } = await this.#getMarkerFeatureCollection(token, params)
      features?.length
        ? this.#setMarkers(id, cloneDeep(features))
        : this.#consoleError(`No ${id.toUpperCase()} Features Found`)
    }
  }

  async #getMarkerFeatureCollection(token: string, params: IQueryParam): Promise<FeatureCollection> {
    return this.#apiService.getGeoJSONFeatureCollection(token, params)
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
    el.addEventListener('mouseenter', (): void => this.#popupService.addMarkerPopup(feature))
    el.addEventListener('touchstart', (): void => this.#popupService.addMarkerPopup(feature), { passive: true })
    el.addEventListener('mouseleave', (): void => this.#popupService.removePopup())
    el.addEventListener('touchend', (): void => this.#popupService.removePopup())
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
    const state = { ...this.#markerVisibilityState }
    state[id as keyof IMarkerVisibility].isActive = !state[id as keyof IMarkerVisibility].isActive
    this.#markerVisibilityState = state
  }

  #setHiddenMarkers(id: string, markers: Marker[]): void {
    this.#setHiddenMarkerVisibilityState(id)
    for (const marker of markers) {
      this.#addRemoveHiddenMarkers(id, marker)
    }
  }

  #setHiddenMarkerVisibilityState(id: string): void {
    const state = { ...this.#markerVisibilityState }
    state[id as keyof IMarkerVisibility].isHidden = !state[id as keyof IMarkerVisibility].isHidden
    this.#markerVisibilityState = state
  }

  #addRemoveMarkers(id: string, marker: Marker): void {
    this.#markerVisibilityState[id as keyof IMarkerVisibility].isActive
      ? this.#addMarker(marker)
      : this.#removeMarker(marker)
  }

  #addRemoveHiddenMarkers(id: string, marker: Marker): void {
    this.#markerVisibilityState[id as keyof IMarkerVisibility].isHidden
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
