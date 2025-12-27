import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
  signal
} from '@angular/core';
import { NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import type { Map, Marker } from 'maplibre-gl';
import { MapService } from '../../shared/map/map.service';
import { Poi } from '../../shared/models/tour.models';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { fromEvent } from 'rxjs';
import maplibregl from 'maplibre-gl';

const DEFAULT_STYLE_URL = 'https://demotiles.maplibre.org/style.json';

@Component({
  selector: 'app-map-canvas',
  standalone: true,
  imports: [NgIf, MatButtonModule, MatIconModule],
  templateUrl: './map-canvas.component.html',
  styleUrls: ['./map-canvas.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MapCanvasComponent implements AfterViewInit, OnChanges {
  @ViewChild('mapContainer', { static: true })
  protected mapContainer!: ElementRef<HTMLDivElement>;

  @Input() routeGeoJsonUrl!: string;
  @Input() pois: Poi[] = [];
  @Input() currentPoiId: string | null = null;
  @Input() styleUrl: string = DEFAULT_STYLE_URL;
  @Input() visitedIds: Set<string> | null = null;

  @Output() poiSelected = new EventEmitter<Poi>();
  protected readonly hasUserLocation = signal(false);
  protected readonly is3d = signal(false);

  protected map: Map | null = null;
  private markers: Marker[] = [];
  private userMarker: Marker | null = null;

  constructor(
    private readonly mapService: MapService,
    private readonly destroyRef: DestroyRef
  ) {}

  ngAfterViewInit(): void {
    this.initMap();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.map) {
      return;
    }

    if (changes['routeGeoJsonUrl'] && this.routeGeoJsonUrl) {
      this.mapService.setRouteFromGeoJson(this.map, 'tour', this.routeGeoJsonUrl);
    }

    if (changes['pois'] || changes['currentPoiId']) {
      this.resetMarkers();
      this.markers = this.mapService.createPoiMarkers(
        this.map,
        this.pois,
        this.currentPoiId,
        this.visitedIds ?? new Set(),
        (poi) => this.poiSelected.emit(poi)
      );
    }
  }

  private initMap(): void {
    if (this.map) {
      return;
    }

    const center: [number, number] =
      this.pois.length > 0 ? [this.pois[0].lng, this.pois[0].lat] : [-0.1246, 51.5007];

    this.map = this.mapService.initMap({
      container: this.mapContainer.nativeElement,
      center,
      zoom: 14,
      styleUrl: this.styleUrl
    });

    fromEvent(this.map, 'load')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        if (this.routeGeoJsonUrl) {
          this.mapService.setRouteFromGeoJson(this.map!, 'tour', this.routeGeoJsonUrl);
        }

        this.markers = this.mapService.createPoiMarkers(
          this.map!,
          this.pois,
          this.currentPoiId,
          this.visitedIds ?? new Set(),
          (poi) => this.poiSelected.emit(poi)
        );
      });
  }

  protected toggle3d(): void {
    if (!this.map) {
      return;
    }
    const next = !this.is3d();
    this.is3d.set(next);
    this.mapService.set3dEnabled(this.map, next);
  }

  protected locateMe(): void {
    if (!navigator.geolocation || !this.map) {
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords: [number, number] = [
          position.coords.longitude,
          position.coords.latitude
        ];
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
        this.map!.easeTo({ center: coords, zoom: Math.max(this.map!.getZoom(), 15) });
      },
      () => {
        this.hasUserLocation.set(false);
      }
    );
  }

  private resetMarkers(): void {
    this.markers.forEach((marker) => marker.remove());
    this.markers = [];
  }
}


