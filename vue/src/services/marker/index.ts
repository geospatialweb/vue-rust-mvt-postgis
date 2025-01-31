import { Marker } from 'mapbox-gl'
import { Container, Service } from 'typedi'

import { geoJsonParams } from '@/configuration'
import { Event } from '@/enums'
import { ApiService, CredentialsService, LogService, PopupService } from '@/services'

import type { Feature, FeatureCollection, GeoJsonProperties, Geometry, Point } from 'geojson'
import type { LngLat, LngLatLike } from 'mapbox-gl'
import type { IGeoJsonParam } from '@/interfaces'
import type { MarkersHashmap, MarkersReverseHashmap } from '@/types'

@Service()
export default class MarkerService {
  #geoJsonParams = <IGeoJsonParam[]>geoJsonParams
  #markers = <Marker[][]>[]
  #markersHashmap: MarkersHashmap = new Map()
  #markersReverseHashmap: MarkersReverseHashmap = new Map()

  get markers(): Marker[][] {
    return this.#markers
  }

  get markersHashmap(): MarkersHashmap {
    return this.#markersHashmap
  }

  get markersReverseHashmap(): MarkersReverseHashmap {
    return this.#markersReverseHashmap
  }

  setMarkerFeatures = async (jwtToken: string): Promise<void> => {
    for (const geoJsonParams of this.#geoJsonParams) {
      const { features } = await this.#getMarkerFeatureCollection(geoJsonParams, jwtToken)
      if (!features?.length) {
        const { logErrorMessage } = Container.get(LogService)
        return logErrorMessage(`no ${this.setMarkerFeatures.name.slice(3)} found`)
      }
      const { table: id } = geoJsonParams
      this.#setMarkers(id, features)
    }
  }

  async #getMarkerFeatureCollection(geoJsonParams: IGeoJsonParam, jwtToken: string): Promise<FeatureCollection> {
    const { credentialsState: credentials } = Container.get(CredentialsService),
      { getGeoJsonFeatureCollection } = Container.get(ApiService)
    return getGeoJsonFeatureCollection(geoJsonParams, credentials, jwtToken)
  }

  #setMarkers(id: string, features: Feature<Geometry, GeoJsonProperties>[]): void {
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
    const { addMarkerPopup, removePopup } = Container.get(PopupService),
      el = document.createElement('div')
    el.className = id
    el.addEventListener(Event.Mouseenter, (): void => addMarkerPopup(feature), { passive: true })
    el.addEventListener(Event.Touchstart, (): void => addMarkerPopup(feature), { passive: true })
    el.addEventListener(Event.Mouseleave, (): void => removePopup(), { passive: true })
    el.addEventListener(Event.Touchend, (): void => removePopup(), { passive: true })
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
    this.#markersReverseHashmap.set(idx, id)
  }
}
