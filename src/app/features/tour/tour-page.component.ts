import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { NgClass, NgIf, NgSwitch, NgSwitchCase } from '@angular/common';
import { ActivatedRoute, ParamMap, Router, RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BRIXTON_TOUR_ID, LONDON_TOUR_ID, getTourById } from '../../shared/data/sample-tour';
import { SupabaseToursService } from '../../shared/services/supabase-tours.service';
import { SupabasePoisService } from '../../shared/services/supabase-pois.service';
import { PoiStore } from '../../shared/state/poi.store';
import { MapCanvasComponent } from './map-canvas.component';
import { PoiMediaComponent } from './poi-media.component';

type TourMode = 'split' | 'map' | 'gallery' | 'help';

@Component({
  selector: 'app-tour-page',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MapCanvasComponent,
    PoiMediaComponent,
    RouterLink,
    NgClass,
    NgIf,
    NgSwitch,
    NgSwitchCase,
  ],
  templateUrl: './tour-page.component.html',
  styleUrls: ['./tour-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TourPageComponent implements OnInit {
  protected readonly mode = signal<TourMode>('split');

  protected tour = getTourById(LONDON_TOUR_ID)!;

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    protected readonly poiStore: PoiStore,
    private readonly toursService: SupabaseToursService,
    private readonly poisService: SupabasePoisService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const id = params.get('id');
      const tourId = id ?? LONDON_TOUR_ID;

      // Guard: only allow navigating to tours which are marked as published in Supabase.
      this.toursService.getPublishedTourById(tourId).subscribe((remoteTour) => {
        if (!remoteTour) {
          void this.router.navigate(['/'], { replaceUrl: true });
          return;
        }

        const tour = getTourById(tourId);
        if (!tour) {
          void this.router.navigate(['/'], { replaceUrl: true });
          return;
        }

        const effectiveTour = {
          ...tour,
          routeGeoJsonUrl: remoteTour.route_url ?? tour.routeGeoJsonUrl,
        };

        this.poisService.getPoisForTour(tourId).subscribe((pois) => {
          if (pois.length === 0) {
            void this.router.navigate(['/'], { replaceUrl: true });
            return;
          }

          this.tour = effectiveTour;
          this.poiStore.loadTour(effectiveTour, pois);
        });
      });
    });
  }

  protected setMode(value: TourMode): void {
    this.mode.set(value);
  }

  protected isMode(value: TourMode): boolean {
    return this.mode() === value;
  }

  protected nextPoiTitle(): string | null {
    const pois = this.poiStore.pois();
    const currentIndex = this.poiStore.currentIndex();

    if (!pois.length || currentIndex < 0 || currentIndex >= pois.length - 1) {
      return null;
    }

    return pois[currentIndex + 1]?.title ?? null;
  }

  protected goHome(): void {
    void this.router.navigate(['/']);
  }
}
