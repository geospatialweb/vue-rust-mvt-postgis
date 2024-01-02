import MapboxDraw from '@mapbox/mapbox-gl-draw'
import { AnyLayer, FillLayer, LineLayer, Map, MapLayerMouseEvent, NavigationControl, SkyLayer } from 'mapbox-gl'
import { Container, Service } from 'typedi'

import { mapbox, mapboxDraw } from '@/configuration'
import { LayerId, StoreStates } from '@/enums'
import {
  ILayerElement,
  ILayerId,
  ILayerVisibility,
  IMapboxOption,
  IMapboxSetting,
  IMapboxStyle,
  INavigationControl,
  IStoreStates,
  ITrail
} from '@/interfaces'
import {
  AppService,
  LayerElementService,
  LayerService,
  LayerVisibilityService,
  MapboxStyleService,
  MarkerService,
  ModalService,
  PopupService,
  StoreService
} from '@/services'
import { NavigationControlPosition } from '@/types'

@Service()
export default class MapboxService {
  #layerService = Container.get(LayerService)
  #layerVisibilityService = Container.get(LayerVisibilityService)
  #mapboxStyleService = Container.get(MapboxStyleService)
  #markerService = Container.get(MarkerService)
  #modalService = Container.get(ModalService)
  #popupService = Container.get(PopupService)
  #storeService = Container.get(StoreService)
  #layerId: ILayerId = LayerId
  #mapboxDraw: MapboxDraw = new MapboxDraw(mapboxDraw.options)
  #mapboxOptions: IMapboxOption = mapbox.options
  #navigationControl: INavigationControl = mapbox.navigationControl
  #skyLayer: SkyLayer = <SkyLayer>mapbox.skyLayer
  #storeStates: IStoreStates = StoreStates

  constructor(private _map: Map) {}

  get map(): Map {
    return this._map
  }

  get #mapboxSettingsState(): IMapboxSetting {
    return <IMapboxSetting>this.#storeService.getState(this.#storeStates.MAPBOX_SETTINGS)
  }

  set #mapboxSettingsState(state: IMapboxSetting) {
    this.#storeService.setState(this.#storeStates.MAPBOX_SETTINGS, state)
  }

  loadMap(): void {
    const { position, visualizePitch } = this.#navigationControl
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

  resetMap(): void {
    this.#setMapboxStyle()
    this.#resetMapLayers()
  }

  mapFlyTo({ center, zoom }: ITrail): void {
    this._map.flyTo({ center, zoom })
  }

  removeMapResources(): void {
    this._map && this._map.remove()
  }

  setInitialZoomState(zoom: number): void {
    this.#mapboxSettingsState = { ...this.#mapboxSettingsState, zoom }
  }

  setLayerVisibility(id: string): void {
    const appService = Container.get(AppService),
      /* prettier-ignore */
      { appState: { isMobile }} = appService,
      { layerVisibilityState } = this.#layerVisibilityService

    if (layerVisibilityState[id as keyof ILayerVisibility].isActive) {
      this.#setMapLayoutProperty(id, 'visible')
      id === this.#layerId.BIOSPHERE && !isMobile && this.#addLayerVisibilityEventListeners(id)
    }
    if (!layerVisibilityState[id as keyof ILayerVisibility].isActive) {
      this.#setMapLayoutProperty(id, 'none')
      id === this.#layerId.BIOSPHERE && !isMobile && this.#removeLayerVisibilityEventListeners(id)
    }
  }

  #drawModeChange(): void {
    const layerElementService = Container.get(LayerElementService),
      { layerElementsState } = layerElementService,
      layerElement = (layerElement: ILayerElement): boolean => layerElement.id === this.#layerId.BIOSPHERE,
      idx = layerElementsState.findIndex(layerElement)
    if (idx >= 0 && layerElementsState[idx].isActive) {
      layerElementService.displayLayerElement(<LayerId>this.#layerId.BIOSPHERE)
    }
  }

  #hideModal(): void {
    this.#modalService.hideModal()
  }

  #setMapLayoutProperty(id: string, visibility: string): void {
    this._map.setLayoutProperty(id, 'visibility', visibility)
  }

  #setMapboxSettingsState(): void {
    const { activeMapboxStyle, mapboxStylesState } = this.#mapboxStyleService,
      style = mapboxStylesState[activeMapboxStyle as keyof IMapboxStyle].url
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
    this.#mapboxStyleService.setMapboxStylesState()
    this.#mapboxStyleService.setActiveMapboxStyle()
    const { activeMapboxStyle, mapboxStylesState } = this.#mapboxStyleService,
      style = mapboxStylesState[activeMapboxStyle as keyof IMapboxStyle].url
    this._map.setStyle(style)
  }

  #setMapLayers(): void {
    this.#addSkyLayer()
    this.#addFeatureLayers()
    this.#setHiddenMarkersVisibility()
  }

  /* Set layers & hidden marker visibility timeouts to allow basemap to finish loading when switching basemaps */
  #resetMapLayers(): void {
    window.setTimeout((): void => this.#addSkyLayer(), 100)
    window.setTimeout((): void => {
      this.#addFeatureLayers()
      this.#setHiddenMarkersVisibility()
    }, 1000)
  }

  #addSkyLayer(): void {
    const { id } = this.#skyLayer
    this.#getLayer(id) ?? this.#addLayer(this.#skyLayer)
  }

  #addFeatureLayers(): void {
    const { layers } = this.#layerService
    for (const layer of layers) {
      const { id } = layer
      if (!this.#getLayer(id)) {
        this.#addLayer(<FillLayer | LineLayer>layer)
        this.setLayerVisibility(id)
      }
    }
  }

  #addLayer(layer: AnyLayer): void {
    this._map.addLayer(layer)
  }

  #getLayer(id: string): AnyLayer | undefined {
    return this._map.getLayer(id)
  }

  #setHiddenMarkersVisibility(): void {
    window.setTimeout((): void => this.#markerService.setHiddenMarkersVisibility(), 100)
  }

  #addLayerVisibilityEventListeners(id: string): void {
    this._map
      .on('click', id, (evt: MapLayerMouseEvent): void => this.#onMapClickHandler(evt))
      .on('mouseenter', id, (): void => this.#onMapMouseEnterHandler())
      .on('mouseleave', id, (): void => this.#onMapMouseLeaveHandler())
  }

  #removeLayerVisibilityEventListeners(id: string): void {
    this._map
      .off('click', id, (evt: MapLayerMouseEvent): void => this.#onMapClickHandler(evt))
      .off('mouseenter', id, (): void => this.#onMapMouseEnterHandler())
      .off('mouseleave', id, (): void => this.#onMapMouseLeaveHandler())
  }

  #onMapClickHandler({ lngLat, point }: MapLayerMouseEvent): void {
    const { properties } = this._map.queryRenderedFeatures(point)[0]
    this.#popupService.addLayerPopup(lngLat, properties)
  }

  #onMapMouseEnterHandler(): void {
    this.#setCursorStyle('pointer')
  }

  #onMapMouseLeaveHandler(): void {
    this.#popupService.removePopup()
    this.#setCursorStyle('')
  }

  #setCursorStyle(cursor: string): void {
    this._map.getCanvas().style.cursor = cursor
  }
}
