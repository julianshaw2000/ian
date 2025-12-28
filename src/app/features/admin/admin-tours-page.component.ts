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
}


