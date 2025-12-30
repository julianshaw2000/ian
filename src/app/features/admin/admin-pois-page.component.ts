import { ChangeDetectionStrategy, Component, OnInit, computed, signal } from '@angular/core';
import { NgForOf, NgIf } from '@angular/common';
import { ActivatedRoute, ParamMap, Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { SupabaseAuthService } from '../../shared/services/supabase-auth.service';
import { SupabasePoisService } from '../../shared/services/supabase-pois.service';
import { SupabaseMediaService } from '../../shared/services/supabase-media.service';

@Component({
  selector: 'app-admin-pois-page',
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
  templateUrl: './admin-pois-page.component.html',
  styleUrls: ['./admin-pois-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminPoisPageComponent implements OnInit {
  readonly pois = signal<any[]>([]);
  readonly selectedId = signal<string | null>(null);
  readonly isEditingExisting = computed(() => !!this.selectedId());

  readonly form;

  readonly saving = signal(false);
  readonly errorMessage = signal<string | null>(null);
  tourId = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly fb: FormBuilder,
    private readonly poisService: SupabasePoisService,
    private readonly mediaService: SupabaseMediaService,
    protected readonly auth: SupabaseAuthService
  ) {
    this.form = this.fb.nonNullable.group({
      id: ['', [Validators.required]],
      title: ['', [Validators.required]],
      address: [''],
      order_index: [1],
      lat: [0, [Validators.required]],
      lng: [0, [Validators.required]],
      description: [''],
      audio_url: [''],
      is_published: [true]
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const id = params.get('id');
      if (!id) {
        void this.router.navigate(['/admin/tours'], { replaceUrl: true });
        return;
      }
      this.tourId = id;
      this.refresh();
    });
  }

  refresh(): void {
    if (!this.tourId) {
      return;
    }
    this.poisService.getPoisForTourAdmin(this.tourId).subscribe((rows) => {
      this.pois.set(rows);
    });
  }

  newPoi(): void {
    this.selectedId.set(null);
    this.form.reset({
      id: '',
      title: '',
      address: '',
      order_index: 1,
      lat: 0,
      lng: 0,
      description: '',
      audio_url: '',
      is_published: true
    });
  }

  editPoi(row: any): void {
    this.selectedId.set(row.id);
    this.form.patchValue(row);
  }

  async uploadAudio(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      return;
    }

    const poiId = this.form.get('id')?.value;
    if (!poiId) {
      this.errorMessage.set('Please set a POI ID before uploading audio.');
      input.value = '';
      return;
    }

    this.saving.set(true);
    this.errorMessage.set(null);
    const result = await this.mediaService.uploadPoiAudio(this.tourId, poiId, file);
    this.saving.set(false);
    input.value = '';

    if (result.error || !result.url) {
      this.errorMessage.set(result.error ?? 'Failed to upload audio.');
      return;
    }

    this.form.patchValue({ audio_url: result.url });
  }

  async save(): Promise<void> {
    if (this.form.invalid || this.saving()) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.errorMessage.set(null);
    const value = this.form.getRawValue();

    const row = {
      ...value,
      tour_id: this.tourId
    };

    const result = await this.poisService.upsertPoi(row as any);
    this.saving.set(false);

    if (result.error) {
      this.errorMessage.set(result.error);
      return;
    }

    this.refresh();
  }

  async delete(row: any): Promise<void> {
    if (this.saving()) {
      return;
    }

    const confirmed = window.confirm(`Delete POI "${row.title}"? This cannot be undone.`);
    if (!confirmed) {
      return;
    }

    this.saving.set(true);
    this.errorMessage.set(null);
    const result = await this.poisService.deletePoi(row.id);
    this.saving.set(false);

    if (result.error) {
      this.errorMessage.set(result.error);
      return;
    }

    if (this.selectedId() === row.id) {
      this.newPoi();
    }

    this.refresh();
  }

  async logout(): Promise<void> {
    await this.auth.signOut();
    await this.router.navigate(['/']);
  }
}


