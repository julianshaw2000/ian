import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  ViewChild,
  signal,
  computed,
  AfterViewInit
} from '@angular/core';
import { NgIf, NgForOf } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Poi } from '../../shared/models/tour.models';

type PoiMediaMode = 'split' | 'gallery';

@Component({
  selector: 'app-poi-media',
  standalone: true,
  imports: [NgIf, NgForOf, MatIconModule, MatButtonModule],
  templateUrl: './poi-media.component.html',
  styleUrls: ['./poi-media.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PoiMediaComponent implements AfterViewInit {
  @Input() poi: Poi | null = null;
  @Input() mode: PoiMediaMode = 'split';

  @ViewChild('audioRef') private audioRef?: ElementRef<HTMLAudioElement>;

  protected readonly activeImageIndex = signal(0);
  protected readonly isPlaying = signal(false);
  protected readonly currentTime = signal(0);
  protected readonly duration = signal(0);

  protected readonly images = computed(() => this.poi?.images ?? []);
  protected readonly hasMultipleImages = computed(() => this.images().length > 1);
  protected readonly currentImage = computed(() => {
    const imgs = this.images();
    const idx = this.activeImageIndex();
    return imgs[idx] ?? null;
  });

  protected readonly audioUrl = computed(() => this.poi?.audioByLanguage['en']);

  ngAfterViewInit(): void {
    const audio = this.audioRef?.nativeElement;
    if (!audio) {
      return;
    }

    audio.addEventListener('loadedmetadata', () => {
      this.duration.set(audio.duration || 0);
    });

    audio.addEventListener('timeupdate', () => {
      this.currentTime.set(audio.currentTime || 0);
    });

    audio.addEventListener('ended', () => {
      this.isPlaying.set(false);
    });
  }

  protected nextImage(): void {
    const imgs = this.images();
    if (imgs.length < 2) {
      return;
    }
    const next = (this.activeImageIndex() + 1) % imgs.length;
    this.activeImageIndex.set(next);
  }

  protected previousImage(): void {
    const imgs = this.images();
    if (imgs.length < 2) {
      return;
    }
    const prev = (this.activeImageIndex() - 1 + imgs.length) % imgs.length;
    this.activeImageIndex.set(prev);
  }

  protected togglePlay(): void {
    const audio = this.audioRef?.nativeElement;
    if (!audio || !this.audioUrl()) {
      return;
    }
    if (this.isPlaying()) {
      audio.pause();
      this.isPlaying.set(false);
    } else {
      void audio.play();
      this.isPlaying.set(true);
    }
  }

  protected seekBy(seconds: number): void {
    const audio = this.audioRef?.nativeElement;
    if (!audio) {
      return;
    }
    const target = Math.min(Math.max(audio.currentTime + seconds, 0), this.duration());
    audio.currentTime = target;
    this.currentTime.set(target);
  }

  protected onScrubChange(event: Event): void {
    const audio = this.audioRef?.nativeElement;
    if (!audio) {
      return;
    }
    const input = event.target as HTMLInputElement;
    const value = Number(input.value);
    audio.currentTime = value;
    this.currentTime.set(value);
  }

  protected formatTime(value: number): string {
    if (!isFinite(value) || value <= 0) {
      return '0:00';
    }
    const minutes = Math.floor(value / 60);
    const seconds = Math.floor(value % 60)
      .toString()
      .padStart(2, '0');
    return `${minutes}:${seconds}`;
  }
}


