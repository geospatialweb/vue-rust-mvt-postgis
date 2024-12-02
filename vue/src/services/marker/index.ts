import { Feature, FeatureCollection, GeoJsonProperties, Geometry, Point } from 'geojson'
import { LngLat, LngLatLike, Marker } from 'mapbox-gl'
import { Container, Service } from 'typedi'

import { markerParams } from '@/configuration'
import { IQueryParam } from '@/interfaces'
import { ApiService, LogService, PopupService } from '@/services'

@Service()
export default class MarkerService {
  #markerParams: IQueryParam[] = markerParams
  #markers: Marker[][] = []
  #markersHashmap: Map<string, number> = new Map()
  #reverseMarkersHashmap: Map<number, string> = new Map()

  get markers(): Marker[][] {
    return this.#markers
  }

  get markersHashmap(): Map<string, number> {
    return this.#markersHashmap
  }

  get reverseMarkersHashmap(): Map<number, string> {
    return this.#reverseMarkersHashmap
  }

  async setMarkerFeatures(jwtToken: string): Promise<void> {
    for (const params of this.#markerParams) {
      const { id } = params,
        { features } = await this.#getMarkerFeatureCollection(jwtToken, params)
      if (features?.length) {
        this.#setMarkers(id, features)
      } else {
        const logService = Container.get(LogService)
        logService.logMarkersError(`No ${id.toUpperCase()} Features Found`)
      }
    }
  }

  async #getMarkerFeatureCollection(jwtToken: string, params: IQueryParam): Promise<FeatureCollection> {
    const apiService = Container.get(ApiService)
    return apiService.getGeoJSONFeatureCollection(jwtToken, params)
  }

  #setMarkers(id: string, features: Feature<Geometry, GeoJsonProperties>[]): void {
    if (!features?.length) {
      const logService = Container.get(LogService)
      return logService.logMarkersError(`no ${this.#setMarkers.name.slice(4)} features found`)
    }
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
    const popupService = Container.get(PopupService),
      el = document.createElement('div')
    el.className = id
    el.addEventListener('mouseenter', (): void => popupService.addMarkerPopup(feature), { passive: true })
    el.addEventListener('touchstart', (): void => popupService.addMarkerPopup(feature), { passive: true })
    el.addEventListener('mouseleave', (): void => popupService.removePopup(), { passive: true })
    el.addEventListener('touchend', (): void => popupService.removePopup(), { passive: true })
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
}
