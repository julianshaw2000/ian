import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { NgClass, NgIf, NgSwitch, NgSwitchCase } from '@angular/common';
import { ActivatedRoute, ParamMap, Router, RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BRIXTON_TOUR_ID, LONDON_TOUR_ID, getPoisForTour, getTourById } from '../../shared/data/sample-tour';
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
    NgSwitchCase
  ],
  templateUrl: './tour-page.component.html',
  styleUrls: ['./tour-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TourPageComponent implements OnInit {
  protected readonly mode = signal<TourMode>('split');

  protected tour = getTourById(LONDON_TOUR_ID)!;

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    protected readonly poiStore: PoiStore
  ) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const id = params.get('id');
      const tourId = id ?? LONDON_TOUR_ID;
      const tour = getTourById(tourId);
      const pois = getPoisForTour(tourId);

      if (!tour || pois.length === 0) {
        void this.router.navigate(['/'], { replaceUrl: true });
        return;
      }

      this.tour = tour;
      this.poiStore.loadTour(tour, pois);
    });
  }

  protected setMode(value: TourMode): void {
    this.mode.set(value);
  }

  protected isMode(value: TourMode): boolean {
    return this.mode() === value;
  }

  protected goHome(): void {
    void this.router.navigate(['/']);
  }
}


