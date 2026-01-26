import { Injectable } from '@angular/core';
import maplibregl, { Map, Marker, LngLatLike } from 'maplibre-gl';
import { Poi } from '../models/tour.models';

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
  providedIn: 'root',
})
export class MapService {
  /**
   * Initialize a new MapLibre map instance
   */
  initMap(options: MapInitOptions): Map {
    const map = new maplibregl.Map({
      container: options.container,
      style: options.styleUrl,
      center: options.center,
      zoom: options.zoom,
      pitch: options.pitch ?? 0,
      bearing: options.bearing ?? 0,
      attributionControl: false,
    });

    // Add navigation controls (zoom buttons, compass)
    map.addControl(new maplibregl.NavigationControl({ showCompass: true }), 'top-right');

    // Add attribution control at bottom
    map.addControl(new maplibregl.AttributionControl({ compact: true }));

    return map;
  }

  /**
   * Load and display a GeoJSON route on the map
   */
  async setRouteFromGeoJson(map: Map, id: string, url: string, color = '#1976d2'): Promise<void> {
    const sourceId = `${id}-route`;
    const layerId = `${id}-route-line`;

    // Remove existing layers/sources if present
    if (map.getLayer(layerId)) {
      map.removeLayer(layerId);
    }
    if (map.getSource(sourceId)) {
      map.removeSource(sourceId);
    }

    // Fetch GeoJSON data with error handling
    try {
      const response = await fetch(url);
      if (!response.ok) {
        console.warn(`Failed to load route GeoJSON from ${url}: ${response.statusText}`);
        return;
      }

      const geojson = await response.json();

      // Add GeoJSON source
      map.addSource(sourceId, {
        type: 'geojson',
        data: geojson,
      });

      // Add line layer to visualize the route
      map.addLayer({
        id: layerId,
        type: 'line',
        source: sourceId,
        paint: {
          'line-color': color,
          'line-width': 4,
        },
      });
    } catch (error) {
      console.warn(`Failed to load or parse route GeoJSON from ${url}:`, error);
    }
  }

  /**
   * Create interactive POI markers on the map
   */
  createPoiMarkers(
    map: Map,
    pois: Poi[],
    currentPoiId: string | null,
    visitedIds: Set<string>,
    onClick: (poi: Poi) => void
  ): Marker[] {
    // Sort POIs so current one is added last (appears on top)
    const sortedPois = [...pois].sort((a, b) => {
      if (a.id === currentPoiId) return 1;
      if (b.id === currentPoiId) return -1;
      return 0;
    });

    return sortedPois.map((poi, sortedIndex) => {
      const el = document.createElement('button');
      el.type = 'button';
      el.className = 'vh-poi-marker';

      const isCurrent = poi.id === currentPoiId;
      const isVisited = visitedIds.has(poi.id);
      const index = pois.indexOf(poi);

      // Style based on state
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

      // Display POI number
      el.textContent = String(index + 1);

      // Add click handler
      el.addEventListener('click', () => {
        onClick(poi);
      });

      // Create and add marker to map
      return new maplibregl.Marker({ element: el })
        .setLngLat([poi.lng, poi.lat])
        .addTo(map);
    });
  }

  /**
   * Enable or disable 3D building visualization
   */
  set3dEnabled(map: Map, enabled: boolean): void {
    const layerId = 'vh-3d-buildings';

    if (!enabled) {
      if (map.getLayer(layerId)) {
        map.removeLayer(layerId);
      }
      return;
    }

    // Don't add if already present
    if (map.getLayer(layerId)) {
      return;
    }

    // Check if the style has an openmaptiles source
    if (!map.getSource('openmaptiles')) {
      console.warn('3D buildings require a map style with openmaptiles source');
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
        'fill-extrusion-opacity': 0.6,
      },
    });
  }

  /**
   * Fit the map view to show all POIs with intelligent handling
   * - 0 POIs: show default location (London) at zoom 12
   * - 1 POI: fly to that POI at zoom 15
   * - 2+ POIs: fit bounds with padding
   */
  fitMapToPois(map: Map, pois: Poi[], options?: FitBoundsOptions): void {
    const defaultPadding = options?.padding ?? 50;
    const defaultMaxZoom = options?.maxZoom ?? 16;
    const duration = options?.duration ?? 1000;

    // Case 1: No POIs - show default location
    if (pois.length === 0) {
      map.flyTo({
        center: [-0.1246, 51.5007], // London
        zoom: 12,
        duration,
      });
      return;
    }

    // Case 2: Single POI - fly to it with tight zoom
    if (pois.length === 1) {
      map.flyTo({
        center: [pois[0].lng, pois[0].lat],
        zoom: 17,
        duration,
      });
      return;
    }

    // Case 3: Multiple POIs - fit bounds
    const bounds = new maplibregl.LngLatBounds();
    pois.forEach((poi) => {
      bounds.extend([poi.lng, poi.lat]);
    });

    map.fitBounds(bounds, {
      padding: defaultPadding,
      maxZoom: defaultMaxZoom,
      duration,
    });
  }

  /**
   * Fly to a specific POI location
   */
  flyToPoi(map: Map, poi: Poi, zoom = 15, duration = 1000): void {
    map.flyTo({
      center: [poi.lng, poi.lat],
      zoom,
      duration,
    });
  }
}
