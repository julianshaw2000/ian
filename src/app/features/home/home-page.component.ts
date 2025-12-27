import { ChangeDetectionStrategy, Component, computed } from '@angular/core';
import { NgForOf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { ALL_TOURS, BRIXTON_TOUR_ID, LONDON_TOUR_ID } from '../../shared/data/sample-tour';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, MatCardModule, RouterLink, NgForOf],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePageComponent {
  protected readonly tours = ALL_TOURS;
  protected readonly tags = computed(() => ['Audio-guided', 'Offline ready', 'Immersive']);

  protected readonly locationLabel = (id: string): string => {
    switch (id) {
      case LONDON_TOUR_ID:
        return 'Central London · English';
      case BRIXTON_TOUR_ID:
        return 'Brixton · English';
      default:
        return 'London · English';
    }
  };
}


