import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { DecimalPipe, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { SupabaseToursService, SupabaseTour } from '../../shared/services/supabase-tours.service';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    RouterLink,
    NgIf,
    DecimalPipe,
  ],
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent {
  protected readonly tours = signal<SupabaseTour[] | null>(null);
  protected readonly tags = computed(() => ['Audio-guided', 'Offline ready', 'Immersive']);

  constructor(private readonly toursService: SupabaseToursService) {
    this.toursService.getPublishedTours().subscribe((t) => this.tours.set(t));
  }

  protected readonly hasTours = computed(() => (this.tours() ?? []).length > 0);

  protected readonly locationLabel = (tour: SupabaseTour): string => {
    if (!tour.location) {
      return 'City walk · English';
    }
    return `${tour.location} · English`;
  };
}
