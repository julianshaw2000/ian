import { Component, computed, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ThemeService, type ThemeMode } from '../services/theme.service';

@Component({
    selector: 'app-theme-toggle',
    standalone: true,
    imports: [MatButtonModule, MatIconModule, MatTooltipModule],
    template: `
    <button
      mat-icon-button
      (click)="toggleTheme()"
      [attr.aria-label]="ariaLabel()"
      [matTooltip]="tooltipText()"
      class="theme-toggle-btn"
    >
      <mat-icon [fontIcon]="icon()"></mat-icon>
    </button>
  `,
    styles: [
        `
      .theme-toggle-btn {
        transition: transform 0.2s ease;

        &:hover {
          transform: scale(1.1);
        }

        mat-icon {
          transition: color 0.3s ease;
        }
      }
    `,
    ],
})
export class ThemeToggleComponent {
    private readonly themeService = inject(ThemeService);

    readonly themeMode = this.themeService.themeMode;
    readonly appliedTheme = this.themeService.appliedTheme;

    readonly icon = computed(() => {
        const mode = this.themeMode();
        switch (mode) {
            case 'light':
                return 'light_mode';
            case 'dark':
                return 'dark_mode';
            case 'auto':
                return 'brightness_auto';
            default:
                return 'brightness_auto';
        }
    });

    readonly tooltipText = computed(() => {
        const mode = this.themeMode();
        switch (mode) {
            case 'light':
                return 'Switch to dark theme';
            case 'dark':
                return 'Switch to auto theme';
            case 'auto':
                return 'Switch to light theme';
            default:
                return 'Toggle theme';
        }
    });

    readonly ariaLabel = computed(() => {
        const mode = this.themeMode();
        return `Current theme: ${mode}. Click to toggle theme.`;
    });

    toggleTheme(): void {
        this.themeService.toggleTheme();
    }
}
