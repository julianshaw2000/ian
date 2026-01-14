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
import { MatSelectModule } from '@angular/material/select';
import { SupabaseAuthService } from '../../shared/services/supabase-auth.service';
import { SupabasePoisService } from '../../shared/services/supabase-pois.service';
import { SupabaseMediaService } from '../../shared/services/supabase-media.service';

@Component({
  selector: 'app-admin-poi-media-page',
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
    MatSelectModule,
    RouterLink
  ],
  templateUrl: './admin-poi-media-page.component.html',
  styleUrls: ['./admin-poi-media-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminPoiMediaPageComponent implements OnInit {
  readonly media = signal<any[]>([]);
  readonly selectedId = signal<string | null>(null);
  readonly isEditingExisting = computed(() => !!this.selectedId());

  readonly form;

  readonly saving = signal(false);
  readonly errorMessage = signal<string | null>(null);
  poiId = '';
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
      id: [''],
      media_type: ['image', [Validators.required]],
      url: ['', [Validators.required]],
      label: [''],
      sort_order: [0]
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const id = params.get('id');
      if (!id) {
        void this.router.navigate(['/admin/tours'], { replaceUrl: true });
        return;
      }
      this.poiId = id;
      this.tourId = this.route.snapshot.queryParamMap.get('tourId') ?? this.tourId;
      this.refresh();
    });
  }

  refresh(): void {
    if (!this.poiId) {
      return;
    }
    this.poisService.getMediaForPoiAdmin(this.poiId).subscribe((rows) => {
      this.media.set(rows);
    });
  }

  newMedia(): void {
    this.selectedId.set(null);
    this.form.reset({
      id: '',
      media_type: 'image',
      url: '',
      label: '',
      sort_order: 0
    });
  }

  editMedia(row: any): void {
    this.selectedId.set(row.id);
    this.form.patchValue(row);
  }

  async uploadFile(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      return;
    }

    const type = this.form.get('media_type')?.value as string;
    if (!type) {
      this.errorMessage.set('Select a media type before uploading.');
      input.value = '';
      return;
    }

    this.saving.set(true);
    this.errorMessage.set(null);

    let result:
      | { url?: string; error?: string }
      | undefined;

    if (type === 'image') {
      result = await this.mediaService.uploadPoiImage(this.tourId || this.poiId, this.poiId, file);
    } else if (type === 'audio' || type === 'music') {
      result = await this.mediaService.uploadPoiAudio(this.tourId || this.poiId, this.poiId, file);
    } else if (type === 'video') {
      result = await this.mediaService.uploadPoiVideo(this.tourId || this.poiId, this.poiId, file);
    } else {
      result = { error: 'File upload is only supported for image, audio and video types.' };
    }

    this.saving.set(false);
    input.value = '';

    if (!result || result.error || !result.url) {
      this.errorMessage.set(result?.error ?? 'Failed to upload media file.');
      return;
    }

    this.form.patchValue({ url: result.url });
  }

  async save(): Promise<void> {
    if (this.form.invalid || this.saving()) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.errorMessage.set(null);
    const value = this.form.getRawValue();

    const result = await this.poisService.upsertMedia(this.poiId, value as any);
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

    const confirmed = window.confirm(`Delete media "${row.label || row.url}"? This cannot be undone.`);
    if (!confirmed) {
      return;
    }

    this.saving.set(true);
    this.errorMessage.set(null);
    const result = await this.poisService.deleteMedia(row.id);
    this.saving.set(false);

    if (result.error) {
      this.errorMessage.set(result.error);
      return;
    }

    if (this.selectedId() === row.id) {
      this.newMedia();
    }

    this.refresh();
  }

  async logout(): Promise<void> {
    await this.auth.signOut();
    await this.router.navigate(['/']);
  }
}


