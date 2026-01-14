import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgForOf, NgIf } from '@angular/common';
import { Location } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SupabaseToursService, SupabaseTour } from '../../shared/services/supabase-tours.service';
import { SupabaseAuthService } from '../../shared/services/supabase-auth.service';

@Component({
  selector: 'app-admin-dashboard-page',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, MatCardModule, MatTooltipModule, RouterLink, NgForOf, NgIf],
  templateUrl: './admin-dashboard-page.component.html',
  styleUrls: ['./admin-dashboard-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminDashboardPageComponent implements OnInit {
  readonly tours = signal<SupabaseTour[]>([]);

  constructor(
    private readonly toursService: SupabaseToursService,
    protected readonly auth: SupabaseAuthService,
    private readonly location: Location,
    private readonly router: Router
  ) {}

  ngOnInit(): void {
    this.toursService.getPublishedTours().subscribe((data) => {
      this.tours.set(data);
    });
  }

  async logout(): Promise<void> {
    await this.auth.signOut();
    await this.router.navigate(['/']);
  }

  async back(): Promise<void> {
    if (window.history.length > 1) {
      this.location.back();
      return;
    }

    await this.router.navigate(['/']);
  }
}


