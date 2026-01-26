import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  effect,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent } from 'rxjs';
import maplibregl, { Map, Marker } from 'maplibre-gl';
import { MapService } from '../../shared/map/map.service';
import { Poi } from '../../shared/models/tour.models';

// Using a better OpenStreetMap style with building footprints and street labels
const DEFAULT_STYLE_URL = 'https://tiles.openfreemap.org/styles/liberty';

@Component({
  selector: 'app-map-canvas',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './map-canvas.component.html',
  styleUrls: ['./map-canvas.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapCanvasComponent implements AfterViewInit {
  // Modern input() function instead of @Input() decorator
  routeGeoJsonUrl = input<string>('');
  pois = input<Poi[]>([]);
  currentPoiId = input<string | null>(null);
  styleUrl = input<string>(DEFAULT_STYLE_URL);
  visitedIds = input<Set<string> | null>(null);

  // Modern output() function
  poiSelected = output<Poi>();

  // Modern viewChild() function
  protected readonly mapContainer = viewChild.required<ElementRef<HTMLDivElement>>('mapContainer');

  // Component state
  protected readonly hasUserLocation = signal(false);
  protected readonly is3d = signal(false);
  protected readonly mapLoaded = signal(false);
  protected readonly mapError = signal<string | null>(null);

  private map: Map | null = null;
  private markers: Marker[] = [];
  private userMarker: Marker | null = null;
  private hasInitiallyFitToPois = false;

  constructor(
    private readonly mapService: MapService,
    private readonly destroyRef: DestroyRef
  ) {
    // React to POI changes using effects
    effect(() => {
      const poisValue = this.pois();
      const currentId = this.currentPoiId();
      const visited = this.visitedIds();

      if (this.map && this.mapLoaded()) {
        this.updateMarkers(poisValue, currentId, visited ?? new Set());
      }
    });

    // React to route changes
    effect(() => {
      const routeUrl = this.routeGeoJsonUrl();
      if (this.map && this.mapLoaded() && routeUrl) {
        void this.mapService.setRouteFromGeoJson(this.map, 'tour', routeUrl);
      }
    });
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap(): void {
    try {
      const container = this.mapContainer().nativeElement;
      const poisValue = this.pois();
      const center: [number, number] =
        poisValue.length > 0 ? [poisValue[0].lng, poisValue[0].lat] : [-0.1246, 51.5007];

      this.map = this.mapService.initMap({
        container,
        center,
        zoom: 16,
        styleUrl: this.styleUrl(),
      });

      // Listen for map load event
      fromEvent(this.map, 'load')
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => {
          this.mapLoaded.set(true);

          // Force resize to ensure map fills container
          setTimeout(() => {
            this.map?.resize();
          }, 100);

          // Load initial data
          const routeUrl = this.routeGeoJsonUrl();
          if (routeUrl) {
            void this.mapService.setRouteFromGeoJson(this.map!, 'tour', routeUrl);
          }

          const poisValue = this.pois();
          const currentId = this.currentPoiId();
          const visited = this.visitedIds();
          this.updateMarkers(poisValue, currentId, visited ?? new Set());

          // Fit to POIs on initial load with tight zoom
          if (poisValue.length > 0 && !this.hasInitiallyFitToPois) {
            this.hasInitiallyFitToPois = true;
            this.mapService.fitMapToPois(this.map!, poisValue, {
              padding: 40,
              maxZoom: 17,
              duration: 1500,
            });
          }
        });

      // Listen for errors
      fromEvent(this.map, 'error')
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((error: any) => {
          console.error('Map error:', error);
          this.mapError.set('Failed to load map. Please try again.');
        });
    } catch (error) {
      console.error('Failed to initialize map:', error);
      this.mapError.set('Failed to initialize map. Please check your connection.');
    }
  }

  private updateMarkers(pois: Poi[], currentId: string | null, visited: Set<string>): void {
    if (!this.map) return;

    // Clear existing markers
    this.markers.forEach((marker) => marker.remove());
    this.markers = [];

    // Create new markers
    this.markers = this.mapService.createPoiMarkers(
      this.map,
      pois,
      currentId,
      visited,
      (poi) => this.poiSelected.emit(poi)
    );

    // Fit to POIs only on first load with tight zoom
    if (pois.length > 0 && !this.hasInitiallyFitToPois) {
      this.hasInitiallyFitToPois = true;
      this.mapService.fitMapToPois(this.map, pois, {
        padding: 40,
        maxZoom: 17,
        duration: 1500,
      });
    }
  }

  protected toggle3d(): void {
    if (!this.map) return;

    const next = !this.is3d();
    this.is3d.set(next);
    this.mapService.set3dEnabled(this.map, next);
  }

  protected locateMe(): void {
    if (!navigator.geolocation || !this.map) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords: [number, number] = [position.coords.longitude, position.coords.latitude];
        this.hasUserLocation.set(true);

        if (this.userMarker) {
          this.userMarker.setLngLat(coords);
        } else {
          const el = document.createElement('div');
          el.className = 'vh-user-puck';
          this.userMarker = new maplibregl.Marker({ element: el })
            .setLngLat(coords)
            .addTo(this.map!);
        }

        this.map!.easeTo({
          center: coords,
          zoom: Math.max(this.map!.getZoom(), 17),
        });
      },
      () => {
        this.hasUserLocation.set(false);
      }
    );
  }

  protected recenterToPois(): void {
    if (!this.map) return;

    this.mapService.fitMapToPois(this.map, this.pois(), {
      padding: 40,
      maxZoom: 17,
      duration: 1500,
    });
  }
}
