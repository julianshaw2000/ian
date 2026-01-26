import { Injectable } from '@angular/core';
import type { Map, Marker, LngLatLike, LngLatBounds } from 'maplibre-gl';
import { Poi } from '../models/tour.models';
import maplibregl from 'maplibre-gl';

export interface MapInitOptions {
  container: HTMLElement;
  center: LngLatLike;
  zoom: number;
  pitch?: number;
  bearing?: number;
  styleUrl: string;
}

export interface FitBoundsOptions {
  padding?: number | { top: number; bottom: number; left: number; right: number };
  maxZoom?: number;
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class MapService {
  initMap(options: MapInitOptions): Map {
    const map = new maplibregl.Map({
      container: options.container,
      style: options.styleUrl,
      center: options.center,
      zoom: options.zoom,
      pitch: options.pitch ?? 0,
      bearing: options.bearing ?? 0,
      attributionControl: false
    });

    map.addControl(new maplibregl.NavigationControl({ showCompass: true }), 'top-right');
    map.addControl(new maplibregl.AttributionControl({ compact: true }));

    return map;
  }

  async setRouteFromGeoJson(map: Map, id: string, url: string, color = '#1976d2'): Promise<void> {
    const sourceId = `${id}-route`;
    const layerId = `${id}-route-line`;

    if (map.getLayer(layerId)) {
      map.removeLayer(layerId);
    }
    if (map.getSource(sourceId)) {
      map.removeSource(sourceId);
    }

    // MapLibre can accept a URL string as GeoJSON data, but if it 404s it may throw a runtime error.
    // We fetch it ourselves so we can fail gracefully and keep the tour usable even without a route file.
    try {
      const response = await fetch(url);
      if (!response.ok) {
        return;
      }
      const geojson = (await response.json()) as unknown;

      map.addSource(sourceId, {
        type: 'geojson',
        data: geojson,
      } as any);
    } catch {
      return;
    }

    map.addLayer({
      id: layerId,
      type: 'line',
      source: sourceId,
      paint: {
        'line-color': color,
        'line-width': 4
      }
    });
  }

  createPoiMarkers(
    map: Map,
    pois: Poi[],
    currentPoiId: string | null,
    visitedIds: Set<string>,
    onClick: (poi: Poi) => void
  ): Marker[] {
    // Sort POIs so that the current one is added last (appears on top)
    const sortedPois = [...pois].sort((a, b) => {
      if (a.id === currentPoiId) return 1;
      if (b.id === currentPoiId) return -1;
      return 0;
    });

    return sortedPois.map((poi) => {
      const el = document.createElement('button');
      el.type = 'button';
      el.className = 'vh-poi-marker';

      const isCurrent = poi.id === currentPoiId;
      const isVisited = visitedIds.has(poi.id);
      const index = pois.indexOf(poi);

      if (isCurrent) {
        el.classList.add('vh-poi-marker--current');
        el.style.zIndex = '1000';
      } else if (isVisited) {
        el.classList.add('vh-poi-marker--visited');
        el.style.zIndex = '100';
      } else {
        el.classList.add('vh-poi-marker--upcoming');
        el.style.zIndex = '50';
      }

      el.textContent = String(index + 1);

      el.addEventListener('click', () => {
        onClick(poi);
      });

      return new maplibregl.Marker({ element: el })
        .setLngLat([poi.lng, poi.lat])
        .addTo(map);
    });
  }

  set3dEnabled(map: Map, enabled: boolean): void {
    const layerId = 'vh-3d-buildings';
    if (!enabled) {
      if (map.getLayer(layerId)) {
        map.removeLayer(layerId);
      }
      return;
    }

    if (map.getLayer(layerId)) {
      return;
    }

    if (!map.getSource('openmaptiles')) {
      return;
    }

    map.addLayer({
      id: layerId,
      type: 'fill-extrusion',
      source: 'openmaptiles',
      'source-layer': 'building',
      paint: {
        'fill-extrusion-color': '#999',
        'fill-extrusion-height': ['get', 'render_height'],
        'fill-extrusion-opacity': 0.6
      }
    });
  }

  /**
   * Fits the map view to show all POIs with intelligent handling for edge cases
   * - 0 POIs: show default city centre (London) at zoom 12
   * - 1 POI: flyTo that POI with zoom 15
   * - 2+ POIs: fitBounds with padding and maxZoom cap
   */
  fitMapToPois(map: Map, pois: Poi[], options?: FitBoundsOptions): void {
    const defaultPadding = options?.padding ?? 50;
    const defaultMaxZoom = options?.maxZoom ?? 16;
    const duration = options?.duration ?? 1000;

    // Case 1: No POIs - show default city centre (London)
    if (pois.length === 0) {
      map.flyTo({
        center: [-0.1246, 51.5007],
        zoom: 12,
        duration
      });
      return;
    }

    // Case 2: Single POI - flyTo that POI with zoom ~15
    if (pois.length === 1) {
      map.flyTo({
        center: [pois[0].lng, pois[0].lat],
        zoom: 15,
        duration
      });
      return;
    }

    // Case 3: Multiple POIs - fitBounds with padding
    const bounds = new maplibregl.LngLatBounds();
    pois.forEach(poi => {
      bounds.extend([poi.lng, poi.lat]);
    });

    map.fitBounds(bounds, {
      padding: defaultPadding,
      maxZoom: defaultMaxZoom,
      duration
    });
  }

  /**
   * Fly to a specific POI location
   */
  flyToPoi(map: Map, poi: Poi, zoom = 15, duration = 1000): void {
    map.flyTo({
      center: [poi.lng, poi.lat],
      zoom,
      duration
    });
  }
}


