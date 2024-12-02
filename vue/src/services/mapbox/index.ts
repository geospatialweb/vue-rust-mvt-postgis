import MapboxDraw from '@mapbox/mapbox-gl-draw'
import { LayerSpecification, Map, MapMouseEvent, NavigationControl, SkyLayerSpecification } from 'mapbox-gl'
import { Container, Service } from 'typedi'

import { mapbox, mapboxDraw } from '@/configuration'
import { Layer, State } from '@/enums'
import {
  ILayerControllerState,
  ILayerVisibilityState,
  IMapboxOption,
  IMapboxSettingsState,
  IMapboxStylesState,
  INavigationControl,
  ITrail
} from '@/interfaces'
import {
  AppService,
  AuthorizationService,
  LayerService,
  LayerControllerService,
  LayerVisibilityService,
  MapboxStyleService,
  MarkerVisibilityService,
  ModalService,
  PopupService,
  StoreService
} from '@/services'
import { NavigationControlPosition } from '@/types'

@Service()
export default class MapboxService {
  #mapboxDraw = new MapboxDraw(mapboxDraw.options)
  #mapboxOptions: IMapboxOption = mapbox.options
  #navigationControl: INavigationControl = mapbox.navigationControl
  #skyLayer = <SkyLayerSpecification>mapbox.skyLayer

  constructor(private _map: Map) {}

  get map(): Map {
    return this._map
  }

  get #mapboxSettingsState(): IMapboxSettingsState {
    const storeService = Container.get(StoreService)
    return <IMapboxSettingsState>storeService.getState(State.MapboxSettings)
  }

  set #mapboxSettingsState(state: IMapboxSettingsState) {
    const storeService = Container.get(StoreService)
    storeService.setState(State.MapboxSettings, state)
  }

  loadMap(): void {
    this.#showModal()
    void this.#loadMap()
  }

  mapFlyTo({ center, zoom }: ITrail): void {
    this._map.flyTo({ center, zoom })
  }

  removeMapResources(): void {
    this._map && this._map.remove()
  }

  resetMap(): void {
    this.#setMapboxStyle()
    this.#resetMapLayers()
  }

  setInitialZoomState(zoom: number): void {
    this.#mapboxSettingsState = { ...this.#mapboxSettingsState, zoom }
  }

  setLayerVisibility(id: string): void {
    /* prettier-ignore */
    const appService = Container.get(AppService),
      layerVisibilityService = Container.get(LayerVisibilityService),
      { appState: { isMobile }} = appService,
      { layerVisibilityState } = layerVisibilityService
    if (layerVisibilityState[id as keyof ILayerVisibilityState].isActive) {
      this.#setMapLayoutProperty(id, 'visible')
      id === `${Layer.Biosphere}` && !isMobile && this.#addLayerVisibilityEventListeners(id)
    }
    if (!layerVisibilityState[id as keyof ILayerVisibilityState].isActive) {
      this.#setMapLayoutProperty(id, 'none')
      id === `${Layer.Biosphere}` && !isMobile && this.#removeLayerVisibilityEventListeners(id)
    }
  }

  async #loadMap(): Promise<void> {
    const { position, visualizePitch } = this.#navigationControl
    await this.#getMapboxAccessToken()
    this._map = new Map({ ...this.#mapboxOptions, ...this.#mapboxSettingsState })
      .addControl(this.#mapboxDraw)
      .addControl(new NavigationControl({ visualizePitch }), <NavigationControlPosition>position)
      .on('draw.modechange', (): void => this.#drawModeChange())
      .on('idle', (): void => this.#setMapboxSettingsState())
      .on('load', (): void => {
        this.#setMapLayers()
        this.#hideModal()
      })
  }

  async #getMapboxAccessToken(): Promise<void> {
    const authorizationService = Container.get(AuthorizationService),
      { mapboxAccessToken } = authorizationService
    if (!mapboxAccessToken) {
      /* prettier-ignore */
      const { jwtState: { jwtToken } } = authorizationService
      await authorizationService.getMapboxAccessToken(jwtToken)
    }
  }

  #drawModeChange(): void {
    const id = `${Layer.Biosphere}`,
      layerControllerService = Container.get(LayerControllerService),
      { layerControllerState } = layerControllerService,
      layer = (layer: ILayerControllerState): boolean => layer.id === id,
      idx = layerControllerState.findIndex(layer)
    if (idx >= 0 && layerControllerState[idx].isActive) {
      layerControllerService.displayLayer(id)
    }
  }

  #hideModal(): void {
    const modalService = Container.get(ModalService)
    modalService.hideModal()
  }

  #showModal(): void {
    const modalService = Container.get(ModalService)
    modalService.showModal()
  }

  #setMapLayoutProperty(id: string, visibility: 'visible' | 'none'): void {
    this._map.setLayoutProperty(id, 'visibility', visibility)
  }

  #setMapboxSettingsState(): void {
    const mapboxStyleService = Container.get(MapboxStyleService),
      { activeMapboxStyle, mapboxStylesState } = mapboxStyleService,
      style = mapboxStylesState[activeMapboxStyle as keyof IMapboxStylesState].url
    this.#mapboxSettingsState = {
      ...this.#mapboxSettingsState,
      bearing: this._map.getBearing(),
      center: this._map.getCenter(),
      pitch: this._map.getPitch(),
      zoom: this._map.getZoom(),
      style
    }
  }

  #setMapboxStyle(): void {
    const mapboxStyleService = Container.get(MapboxStyleService)
    mapboxStyleService.setMapboxStyleState()
    mapboxStyleService.setActiveMapboxStyle()
    const { activeMapboxStyle, mapboxStylesState } = mapboxStyleService,
      style = mapboxStylesState[activeMapboxStyle as keyof IMapboxStylesState].url
    this._map.setStyle(style)
  }

  #setMapLayers(): void {
    this.#addSkyLayer()
    this.#addLayers()
    this.#setHiddenMarkersVisibility()
  }

  /* Set layers & hidden marker visibility timeouts to allow basemap to finish loading when switching basemaps */
  #resetMapLayers(): void {
    window.setTimeout((): void => this.#addSkyLayer(), 100)
    window.setTimeout((): void => {
      this.#addLayers()
      this.#setHiddenMarkersVisibility()
    }, 1000)
  }

  #addSkyLayer(): void {
    const { id } = this.#skyLayer
    this.#getLayer(id) ?? this.#addLayer(this.#skyLayer)
  }

  #addLayers(): void {
    const layerService = Container.get(LayerService),
      { layers } = layerService
    for (const layer of layers) {
      const { id } = layer
      if (!this.#getLayer(id)) {
        this.#addLayer(layer)
        this.setLayerVisibility(id)
      }
    }
  }

  #addLayer(layer: LayerSpecification): void {
    this._map.addLayer(layer)
  }

  #getLayer(id: string): LayerSpecification | undefined {
    return this._map.getLayer(id)
  }

  #setHiddenMarkersVisibility(): void {
    const markerVisibilityService = Container.get(MarkerVisibilityService)
    window.setTimeout((): void => markerVisibilityService.setHiddenMarkersVisibility(), 100)
  }

  #addLayerVisibilityEventListeners(id: string): void {
    this._map
      .on('click', id, (evt: MapMouseEvent): void => this.#onMapClickHandler(evt))
      .on('mouseenter', id, (): void => this.#onMapMouseEnterHandler())
      .on('mouseleave', id, (): void => this.#onMapMouseLeaveHandler())
  }

  #removeLayerVisibilityEventListeners(id: string): void {
    this._map
      .off('click', id, (evt: MapMouseEvent): void => this.#onMapClickHandler(evt))
      .off('mouseenter', id, (): void => this.#onMapMouseEnterHandler())
      .off('mouseleave', id, (): void => this.#onMapMouseLeaveHandler())
  }

  #onMapClickHandler({ lngLat, point }: MapMouseEvent): void {
    const { properties } = this._map.queryRenderedFeatures(point)[0],
      popupService = Container.get(PopupService)
    popupService.addLayerPopup(lngLat, properties)
  }

  #onMapMouseEnterHandler(): void {
    this.#setCursorStyle('pointer')
  }

  #onMapMouseLeaveHandler(): void {
    const popupService = Container.get(PopupService)
    popupService.removePopup()
    this.#setCursorStyle('')
  }

  #setCursorStyle(cursor: string): void {
    this._map.getCanvas().style.cursor = cursor
  }
}
