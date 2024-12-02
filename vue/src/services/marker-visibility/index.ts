import { Marker } from 'mapbox-gl'
import { Container, Service } from 'typedi'

import { State } from '@/enums'
import { IMarkerVisibilityState } from '@/interfaces'
import { MapboxService, MarkerService, StoreService } from '@/services'

@Service()
export default class MarkerVisibilityService {
  get #markerVisibilityState(): IMarkerVisibilityState {
    const storeService = Container.get(StoreService)
    return <IMarkerVisibilityState>storeService.getState(State.MarkerVisibility)
  }

  set #markerVisibilityState(state: IMarkerVisibilityState) {
    const storeService = Container.get(StoreService)
    storeService.setState(State.MarkerVisibility, state)
  }

  setHiddenMarkersVisibility(): void {
    const markerService = Container.get(MarkerService)
    for (const [idx, markers] of markerService.markers.entries()) {
      const id = <string>markerService.reverseMarkersHashmap.get(idx),
        { isActive } = this.#markerVisibilityState[id as keyof IMarkerVisibilityState]
      isActive && this.#setHiddenMarkers(id, markers)
    }
  }

  toggleMarkerVisibility(id: string): void {
    const markerService = Container.get(MarkerService)
    this.#setMarkerVisibilityState(id)
    for (const marker of markerService.markers[<number>markerService.markersHashmap.get(id)]) {
      this.#addRemoveMarkers(id, marker)
    }
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
}
