import { Injectable, signal, effect } from '@angular/core';

export type ThemeMode = 'light' | 'dark' | 'auto';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly STORAGE_KEY = 'city-history-theme';
  private readonly mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

  // Signal for current theme mode
  readonly themeMode = signal<ThemeMode>(this.getStoredTheme());

  // Signal for actual theme being applied (computed from mode and system preference)
  readonly appliedTheme = signal<'light' | 'dark'>('light');

  constructor() {
    // Update applied theme when mode changes or system preference changes
    effect(() => {
      const mode = this.themeMode();
      this.updateAppliedTheme(mode);
    });

    // Listen for system theme changes
    this.mediaQuery.addEventListener('change', () => {
      if (this.themeMode() === 'auto') {
        this.updateAppliedTheme('auto');
      }
    });

    // Apply initial theme
    this.updateAppliedTheme(this.themeMode());
  }

  setTheme(mode: ThemeMode): void {
    this.themeMode.set(mode);
    localStorage.setItem(this.STORAGE_KEY, mode);
  }

  toggleTheme(): void {
    const currentMode = this.themeMode();
    if (currentMode === 'light') {
      this.setTheme('dark');
    } else if (currentMode === 'dark') {
      this.setTheme('auto');
    } else {
      this.setTheme('light');
    }
  }

  private getStoredTheme(): ThemeMode {
    const stored = localStorage.getItem(this.STORAGE_KEY) as ThemeMode;
    return stored || 'auto';
  }

  private updateAppliedTheme(mode: ThemeMode): void {
    const isDark = mode === 'dark' || (mode === 'auto' && this.mediaQuery.matches);
    this.appliedTheme.set(isDark ? 'dark' : 'light');

    // Apply theme to document
    const htmlElement = document.documentElement;
    if (isDark) {
      htmlElement.classList.add('dark-theme');
    } else {
      htmlElement.classList.remove('dark-theme');
    }

    // Update meta theme-color for mobile browsers
    this.updateMetaThemeColor(isDark);
  }

  private updateMetaThemeColor(isDark: boolean): void {
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      // Use your primary colors for theme-color
      metaThemeColor.setAttribute('content', isDark ? '#2a1220' : '#987284');
    }
  }
}
