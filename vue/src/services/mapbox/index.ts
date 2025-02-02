import MapboxDraw from '@mapbox/mapbox-gl-draw'
import { Map, NavigationControl } from 'mapbox-gl'
import { Container, Service } from 'typedi'

import { mapbox, mapboxDraw } from '@/configuration'
import { Event, Layer, State, Visibility } from '@/enums'
import {
  AppService,
  AuthorizationService,
  LayerControllerService,
  LayerVisibilityService,
  MapboxStyleService,
  MarkerVisibilityService,
  ModalService,
  PopupService,
  StoreService,
  VectorLayerService
} from '@/services'

import type { LayerSpecification, MapMouseEvent, SkyLayerSpecification } from 'mapbox-gl'
import type {
  ILayerControllerState,
  ILayerVisibilityState,
  IMapboxOption,
  IMapboxSettingsState,
  INavigationControl,
  ITrail
} from '@/interfaces'
import type { NavigationControlPosition } from '@/types'

@Service()
export default class MapboxService {
  #mapboxDraw = new MapboxDraw(mapboxDraw.options)
  #mapboxOptions = <IMapboxOption>mapbox.options
  #navigationControl = <INavigationControl>mapbox.navigationControl
  #skyLayer = <SkyLayerSpecification>mapbox.skyLayer

  constructor(private _map: Map) {}

  get map(): Map {
    return this._map
  }

  get #mapboxSettingsState(): IMapboxSettingsState {
    const { getState } = Container.get(StoreService)
    return <IMapboxSettingsState>getState(State.MapboxSettings)
  }

  set #mapboxSettingsState(state: IMapboxSettingsState) {
    const { setState } = Container.get(StoreService)
    setState(State.MapboxSettings, state)
  }

  loadMap = (): void => {
    this.#showModal()
    void this.#loadMap()
  }

  mapFlyTo = ({ center, zoom }: ITrail): void => {
    this._map.flyTo({ center, zoom })
  }

  removeMapResources = (): void => {
    this._map && this._map.remove()
  }

  resetMap = (): void => {
    this.#setMapboxStyle()
    this.#resetMapLayers()
  }

  setInitialMapZoomState = (zoom: number): void => {
    const state = <IMapboxSettingsState>{ ...this.#mapboxSettingsState, zoom }
    this.#mapboxSettingsState = state
  }

  setLayerVisibility = (id: string): void => {
    /* prettier-ignore */
    const { appState: { isMobile } } = Container.get(AppService),
      { layerVisibilityState } = Container.get(LayerVisibilityService)
    if (layerVisibilityState[id as keyof ILayerVisibilityState].isActive) {
      this.#setMapLayoutProperty(id, Visibility.Visible)
      if (id === `${Layer.Biosphere}` && !isMobile) this.#addLayerVisibilityEventListeners(id)
    }
    if (!layerVisibilityState[id as keyof ILayerVisibilityState].isActive) {
      this.#setMapLayoutProperty(id, Visibility.None)
      if (id === `${Layer.Biosphere}` && !isMobile) this.#removeLayerVisibilityEventListeners(id)
    }
  }

  async #loadMap(): Promise<void> {
    const { position, visualizePitch } = this.#navigationControl,
      { setMapboxAccessToken } = Container.get(AuthorizationService)
    await setMapboxAccessToken()
    this._map = new Map({ ...this.#mapboxOptions, ...this.#mapboxSettingsState })
      .addControl(this.#mapboxDraw)
      .addControl(new NavigationControl({ visualizePitch }), <NavigationControlPosition>position)
      .on(Event.DrawModeChange, (): void => this.#drawModeChange())
      .on(Event.Idle, (): void => this.#setMapboxSettingsState())
      .on(Event.Load, (): void => {
        this.#setMapLayers()
        this.#hideModal()
      })
  }

  #drawModeChange(): void {
    const id = `${Layer.Biosphere}`,
      layerControllerService = Container.get(LayerControllerService),
      { layerControllerState } = layerControllerService,
      layer = (layer: ILayerControllerState): boolean => layer.id === id,
      idx = layerControllerState.findIndex(layer)
    if (idx >= 0 && layerControllerState[idx].isActive) {
      const { displayLayer } = layerControllerService
      displayLayer(id)
    }
  }

  #setMapboxSettingsState(): void {
    const { activeMapboxStyle } = Container.get(MapboxStyleService)
    this.#mapboxSettingsState = {
      ...this.#mapboxSettingsState,
      bearing: this._map.getBearing(),
      center: this._map.getCenter(),
      pitch: this._map.getPitch(),
      zoom: this._map.getZoom(),
      style: activeMapboxStyle
    }
  }

  #setMapLayers(): void {
    this.#addSkyLayer()
    this.#addLayers()
    this.#setHiddenMarkersVisibility()
  }

  #addSkyLayer(): void {
    const { id } = this.#skyLayer
    this.#getLayer(id) ?? this.#addLayer(this.#skyLayer)
  }

  #addLayers(): void {
    const { vectorLayers } = Container.get(VectorLayerService)
    for (const layer of vectorLayers) {
      const { id } = layer
      if (!this.#getLayer(id)) {
        this.#addLayer(layer)
        this.setLayerVisibility(id)
      }
    }
  }

  #getLayer(id: string): LayerSpecification | undefined {
    return this._map.getLayer(id)
  }

  #addLayer(layer: LayerSpecification): void {
    this._map.addLayer(layer)
  }

  #setHiddenMarkersVisibility(): void {
    const { setHiddenMarkersVisibility } = Container.get(MarkerVisibilityService)
    window.setTimeout((): void => setHiddenMarkersVisibility(), 100)
  }

  #setMapboxStyle(): void {
    const mapboxStyleService = Container.get(MapboxStyleService),
      { setMapboxStyleState, setActiveMapboxStyle } = mapboxStyleService
    setMapboxStyleState()
    setActiveMapboxStyle()
    const { activeMapboxStyle } = mapboxStyleService
    this._map.setStyle(activeMapboxStyle)
  }

  /* Set layers & hidden markers visibility timeouts to allow basemap to finish rendering when switching basemaps */
  #resetMapLayers(): void {
    window.setTimeout((): void => this.#addSkyLayer(), 100)
    window.setTimeout((): void => {
      this.#addLayers()
      this.#setHiddenMarkersVisibility()
    }, 1000)
  }

  #setMapLayoutProperty(id: string, visibility: Visibility.Visible | Visibility.None): void {
    this._map.setLayoutProperty(id, Visibility.Visibility, visibility)
  }

  #addLayerVisibilityEventListeners(id: string): void {
    this._map
      .on(Event.Click, id, (evt: MapMouseEvent): void => this.#onMapClickHandler(evt))
      .on(Event.Mouseenter, id, (): void => this.#onMapMouseEnterHandler())
      .on(Event.Mouseleave, id, (): void => this.#onMapMouseLeaveHandler())
  }

  #removeLayerVisibilityEventListeners(id: string): void {
    this._map
      .off(Event.Click, id, (evt: MapMouseEvent): void => this.#onMapClickHandler(evt))
      .off(Event.Mouseenter, id, (): void => this.#onMapMouseEnterHandler())
      .off(Event.Mouseleave, id, (): void => this.#onMapMouseLeaveHandler())
  }

  #onMapClickHandler({ lngLat, point }: MapMouseEvent): void {
    const { properties } = this._map.queryRenderedFeatures(point)[0],
      { addLayerPopup } = Container.get(PopupService)
    addLayerPopup(lngLat, properties)
  }

  #onMapMouseEnterHandler(): void {
    this.#setCursorStyle('pointer')
  }

  #onMapMouseLeaveHandler(): void {
    this.#setCursorStyle('')
    const { removePopup } = Container.get(PopupService)
    removePopup()
  }

  #setCursorStyle(cursor: string): void {
    this._map.getCanvas().style.cursor = cursor
  }

  #hideModal(): void {
    const { hideModal } = Container.get(ModalService)
    hideModal()
  }

  #showModal(): void {
    const { showModal } = Container.get(ModalService)
    showModal()
  }
}
