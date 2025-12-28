import { ChangeDetectionStrategy, Component, OnInit, computed, signal } from '@angular/core';
import { NgForOf, NgIf } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { Router, RouterLink } from '@angular/router';
import { SupabaseToursService, SupabaseTour } from '../../shared/services/supabase-tours.service';
import { SupabaseAuthService } from '../../shared/services/supabase-auth.service';
import { SupabaseMediaService } from '../../shared/services/supabase-media.service';
import { SupabasePoisService, SupabasePoiRow, SupabasePoiMediaRow } from '../../shared/services/supabase-pois.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-admin-tours-page',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
    RouterLink
  ],
  templateUrl: './admin-tours-page.component.html',
  styleUrls: ['./admin-tours-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminToursPageComponent implements OnInit {
  readonly tours = signal<SupabaseTour[]>([]);
  readonly selectedId = signal<string | null>(null);
  readonly isEditingExisting = computed(() => !!this.selectedId());

  readonly form;

  saving = false;
  errorMessage: string | null = null;

  constructor(
    private readonly fb: FormBuilder,
    private readonly toursService: SupabaseToursService,
    private readonly mediaService: SupabaseMediaService,
    private readonly auth: SupabaseAuthService,
    private readonly poisService: SupabasePoisService,
    private readonly router: Router
  ) {
    this.form = this.fb.nonNullable.group({
      id: ['', [Validators.required]],
      title: ['', [Validators.required]],
      location: [''],
      distance_km: [0],
      duration_minutes: [0],
      price_cents: [0],
      currency: ['GBP'],
      route_url: [''],
      cover_image_url: [''],
      is_published: [false]
    });
  }

  ngOnInit(): void {
    this.refresh();
  }

  refresh(): void {
    this.toursService.getAllTours().subscribe((data) => {
      this.tours.set(data);
    });
  }

  newTour(): void {
    this.selectedId.set(null);
    this.form.reset({
      id: '',
      title: '',
      location: '',
      distance_km: 0,
      duration_minutes: 0,
      price_cents: 0,
      currency: 'GBP',
      route_url: '',
      cover_image_url: '',
      is_published: false
    });
  }

  editTour(tour: SupabaseTour): void {
    this.selectedId.set(tour.id);
    this.form.patchValue({
      ...tour,
      location: tour.location ?? '',
      distance_km: tour.distance_km ?? 0,
      duration_minutes: tour.duration_minutes ?? 0,
      price_cents: tour.price_cents ?? 0,
      currency: tour.currency ?? 'GBP',
      route_url: tour.route_url ?? '',
      cover_image_url: tour.cover_image_url ?? '',
      is_published: tour.is_published
    });
  }

  async logout(): Promise<void> {
    await this.auth.signOut();
    await this.router.navigate(['/']);
  }

  async onCoverSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      return;
    }

    const id = this.form.get('id')?.value;
    if (!id) {
      this.errorMessage = 'Please set a tour ID before uploading a cover image.';
      input.value = '';
      return;
    }

    this.saving = true;
    this.errorMessage = null;
    const result = await this.mediaService.uploadTourCoverImage(id, file);
    this.saving = false;
    input.value = '';

    if (result.error || !result.url) {
      this.errorMessage = result.error ?? 'Failed to upload cover image.';
      return;
    }

    this.form.patchValue({ cover_image_url: result.url });
  }

  async onRouteSelected(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      return;
    }

    const id = this.form.get('id')?.value;
    if (!id) {
      this.errorMessage = 'Please set a tour ID before uploading a route file.';
      input.value = '';
      return;
    }

    this.saving = true;
    this.errorMessage = null;
    const result = await this.mediaService.uploadTourRouteGeoJson(id, file);
    this.saving = false;
    input.value = '';

    if (result.error || !result.url) {
      this.errorMessage = result.error ?? 'Failed to upload route file.';
      return;
    }

    this.form.patchValue({ route_url: result.url });
  }

  async save(): Promise<void> {
    if (this.form.invalid || this.saving) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving = true;
    this.errorMessage = null;
    const value = this.form.getRawValue() as SupabaseTour;

    const result = await this.toursService.upsertTour(value);
    this.saving = false;

    if (result.error) {
      this.errorMessage = result.error;
      return;
    }

    this.refresh();
  }

  async delete(tour: SupabaseTour): Promise<void> {
    if (this.saving) {
      return;
    }

    const confirmed = window.confirm(`Delete tour "${tour.title}"? This cannot be undone.`);
    if (!confirmed) {
      return;
    }

    this.saving = true;
    this.errorMessage = null;

    const result = await this.toursService.deleteTour(tour.id);
    this.saving = false;

    if (result.error) {
      this.errorMessage = result.error;
      return;
    }

    if (this.selectedId() === tour.id) {
      this.newTour();
    }

    this.refresh();
  }

  async exportJson(): Promise<void> {
    const tourId = this.selectedId() ?? this.form.get('id')?.value;
    if (!tourId) {
      this.errorMessage = 'Select or create a tour before exporting JSON.';
      return;
    }

    const tour = this.tours().find((t) => t.id === tourId);
    if (!tour) {
      this.errorMessage = 'Tour not found in the current list.';
      return;
    }

    try {
      const pois = await firstValueFrom(this.poisService.getPoisForTourAdmin(tourId));
      const poisWithMedia: Array<{ poi: SupabasePoiRow; media: SupabasePoiMediaRow[] }> = [];

      for (const poi of pois) {
        const media = await firstValueFrom(this.poisService.getMediaForPoiAdmin(poi.id));
        poisWithMedia.push({ poi, media });
      }

      const exportPayload = {
        tour: {
          id: tour.id,
          title: tour.title,
          tagline: '',
          location: tour.location ?? '',
          distance_km: tour.distance_km ?? 0,
          duration_minutes: tour.duration_minutes ?? 0,
          price_cents: tour.price_cents ?? 0,
          currency: tour.currency ?? 'GBP',
          route: {
            type: 'Feature',
            geometry: {
              type: 'LineString',
              coordinates: [] as number[][]
            },
            properties: {
              name: tour.title,
              route_url: tour.route_url ?? ''
            }
          },
          covers: tour.cover_image_url
            ? [
                {
                  role: 'primary',
                  file_name: this.extractFileName(tour.cover_image_url),
                  caption: '',
                  credit: null
                }
              ]
            : []
        },
        pois: poisWithMedia.map(({ poi, media }) => ({
          id: poi.id,
          order_index: poi.order_index,
          title: poi.title,
          address: poi.address ?? '',
          lat: poi.lat,
          lng: poi.lng,
          is_published: poi.is_published,
          content: {
            language: 'en',
            hook: '',
            story_paragraphs: poi.description ? [poi.description] : [],
            key_facts: []
          },
          media: {
            images: media
              .filter((m) => m.media_type === 'image')
              .map((m) => ({
                role: 'primary',
                file_name: this.extractFileName(m.url),
                caption: m.label ?? '',
                credit: null
              })),
            audio: poi.audio_url
              ? {
                  file_name: this.extractFileName(poi.audio_url),
                  duration_seconds: 0,
                  language: 'en',
                  notes: ''
                }
              : null,
            video: media
              .filter((m) => m.media_type === 'video')
              .map((m) => ({
                type: 'embedded',
                url_or_file: m.url,
                duration_seconds: 0,
                caption: m.label ?? ''
              })),
            links: []
          }
        }))
      };

      const json = JSON.stringify(exportPayload, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `tour-${tourId}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      this.errorMessage = 'Failed to export tour JSON.';
    }
  }

  async onImportJson(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      return;
    }

    try {
      const text = await file.text();
      const parsed = JSON.parse(text) as { tour: any; pois: any[] };

      if (!parsed.tour || !Array.isArray(parsed.pois)) {
        this.errorMessage = 'Invalid JSON format for tour import.';
        return;
      }

      const tourJson = parsed.tour;
      const supabaseTour: SupabaseTour = {
        id: tourJson.id,
        title: tourJson.title,
        location: tourJson.location ?? null,
        distance_km: tourJson.distance_km ?? null,
        duration_minutes: tourJson.duration_minutes ?? null,
        price_cents: tourJson.price_cents ?? null,
        currency: tourJson.currency ?? 'GBP',
        route_url: tourJson.route?.properties?.route_url ?? null,
        cover_image_url:
          Array.isArray(tourJson.covers) && tourJson.covers.length > 0
            ? tourJson.covers[0].file_name ?? null
            : null,
        is_published: tourJson.is_published ?? false
      };

      await this.toursService.upsertTour(supabaseTour);

      for (const poiJson of parsed.pois) {
        const description =
          poiJson.content?.story_paragraphs && Array.isArray(poiJson.content.story_paragraphs)
            ? (poiJson.content.story_paragraphs as string[]).join('\n\n')
            : '';

        const row: SupabasePoiRow = {
          id: poiJson.id,
          tour_id: supabaseTour.id,
          order_index: poiJson.order_index ?? 0,
          lat: poiJson.lat,
          lng: poiJson.lng,
          title: poiJson.title,
          address: poiJson.address ?? null,
          description,
          audio_url: null,
          is_published: poiJson.is_published ?? true
        };

        await this.poisService.upsertPoi(row);
      }

      this.refresh();
    } catch (e) {
      this.errorMessage = 'Failed to import tour JSON.';
    } finally {
      input.value = '';
    }
  }

  private extractFileName(url: string | null): string {
    if (!url) {
      return '';
    }
    const idx = url.lastIndexOf('/');
    return idx >= 0 ? url.substring(idx + 1) : url;
  }
}


