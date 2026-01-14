import { Injectable } from '@angular/core';
import type { Map, Marker, LngLatLike } from 'maplibre-gl';
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
    return pois.map((poi, index) => {
      const el = document.createElement('button');
      el.type = 'button';
      el.className = 'vh-poi-marker';

      const isCurrent = poi.id === currentPoiId;
      const isVisited = visitedIds.has(poi.id);

      if (isCurrent) {
        el.classList.add('vh-poi-marker--current');
      } else if (isVisited) {
        el.classList.add('vh-poi-marker--visited');
      } else {
        el.classList.add('vh-poi-marker--upcoming');
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
}


