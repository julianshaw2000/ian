import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { OfflineToursService } from './shared/state/offline-tours.service';
import { ThemeService } from './shared/services/theme.service';
import { ThemeToggleComponent } from './shared/components/theme-toggle.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ThemeToggleComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  constructor(offlineTours: OfflineToursService, public themeService: ThemeService) {
    offlineTours.init();
    // Theme service is initialized automatically via dependency injection
  }
}
