import { Marker } from 'mapbox-gl'
import { Container, Service } from 'typedi'

import { State } from '@/enums'
import { MapboxService, MarkerService, StoreService } from '@/services'

import type { IMarkerVisibilityState } from '@/interfaces'

@Service()
export default class MarkerVisibilityService {
  get #markerVisibilityState(): IMarkerVisibilityState {
    const { getState } = Container.get(StoreService)
    return <IMarkerVisibilityState>getState(State.MarkerVisibility)
  }

  set #markerVisibilityState(state: IMarkerVisibilityState) {
    const { setState } = Container.get(StoreService)
    setState(State.MarkerVisibility, state)
  }

  setHiddenMarkersVisibility = (): void => {
    const { markers, markersReverseHashmap } = Container.get(MarkerService)
    for (const [idx, marker] of markers.entries()) {
      const id = <string>markersReverseHashmap.get(idx),
        { isActive } = this.#markerVisibilityState[id as keyof IMarkerVisibilityState]
      isActive && this.#setHiddenMarkers(id, marker)
    }
  }

  toggleMarkerVisibility = (id: string): void => {
    const { markers, markersHashmap } = Container.get(MarkerService)
    this.#setMarkerVisibilityState(id)
    for (const marker of markers[Number(markersHashmap.get(id))]) {
      this.#addRemoveMarkers(id, marker)
    }
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

  #addRemoveHiddenMarkers(id: string, marker: Marker): void {
    this.#markerVisibilityState[id as keyof IMarkerVisibilityState].isHidden
      ? this.#removeMarker(marker)
      : this.#addMarker(marker)
  }

  #setMarkerVisibilityState(id: string): void {
    const state = <IMarkerVisibilityState>{ ...this.#markerVisibilityState }
    state[id as keyof IMarkerVisibilityState].isActive = !state[id as keyof IMarkerVisibilityState].isActive
    this.#markerVisibilityState = state
  }

  #addRemoveMarkers(id: string, marker: Marker): void {
    this.#markerVisibilityState[id as keyof IMarkerVisibilityState].isActive
      ? this.#addMarker(marker)
      : this.#removeMarker(marker)
  }

  #addMarker(marker: Marker): void {
    const { map } = Container.get(MapboxService)
    marker.addTo(map)
  }

  #removeMarker(marker: Marker): void {
    marker && marker.remove()
  }
}
