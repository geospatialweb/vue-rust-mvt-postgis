import { Feature, GeoJsonProperties, Point } from 'geojson'
import { LngLat, LngLatLike, Popup } from 'mapbox-gl'
import { Container, Service } from 'typedi'

import { IGeoJSONProperty } from '@/interfaces'
import { MapboxService } from '@/services'

@Service()
export default class PopupService {
  #popup = new Popup({ closeButton: false })

  addLayerPopup(lngLat: LngLatLike, properties: GeoJsonProperties): void {
    if (properties && Reflect.ownKeys(properties)?.length) {
      this.#setLayerPopupLngLat(lngLat)
      this.#setPopupHTML(<IGeoJSONProperty>properties)
      this.#setPopupOffset(4)
      this.#addPopupToMap()
    }
  }

  addMarkerPopup({ geometry, properties }: Feature): void {
    if (properties && Reflect.ownKeys(properties)?.length) {
      this.#setMarkerPopupLngLat(<Feature>{ geometry, properties })
      this.#setPopupHTML(<IGeoJSONProperty>properties)
      this.#setPopupOffset(14)
      this.#addPopupToMap()
    }
  }

  removePopup(): void {
    this.#popup && this.#popup.remove()
  }

  #addPopupToMap(): void {
    const mapboxService = Container.get(MapboxService),
      { map } = mapboxService
    this.#popup.addTo(map)
  }

  #setLayerPopupLngLat(lngLat: LngLatLike): void {
    this.#popup.setLngLat(lngLat)
  }

  #setMarkerPopupLngLat({ geometry, properties }: Feature): void {
    const { lng, lat } = <LngLat>properties
    lng && lat ? this.#popup.setLngLat([lng, lat]) : this.#popup.setLngLat(<LngLatLike>(<Point>geometry).coordinates)
  }

  #setPopupHTML({ description, name }: IGeoJSONProperty): void {
    if (description && name) {
      this.#popup.setHTML(
        `<div class="bold">${name}</div>
         <div>${description}</div>`
      )
    }
  }

  #setPopupOffset(offset: number): void {
    this.#popup.setOffset(offset)
  }
}
