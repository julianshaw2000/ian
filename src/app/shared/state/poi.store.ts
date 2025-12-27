import { Injectable, computed, signal } from '@angular/core';
import { Poi, Tour } from '../models/tour.models';

@Injectable({
  providedIn: 'root'
})
export class PoiStore {
  private readonly tourSignal = signal<Tour | null>(null);
  private readonly poisSignal = signal<Poi[]>([]);
  private readonly currentIndexSignal = signal(0);
  private readonly visitedIdsSignal = signal<Set<string>>(new Set());

  readonly tour = computed(() => this.tourSignal());
  readonly pois = computed(() => this.poisSignal());
  readonly currentIndex = computed(() => this.currentIndexSignal());
  readonly currentPoi = computed(() => {
    const pois = this.poisSignal();
    const idx = this.currentIndexSignal();
    return pois[idx] ?? null;
  });
  readonly visitedIds = computed(() => this.visitedIdsSignal());
  readonly isFirst = computed(() => this.currentIndexSignal() <= 0);
  readonly isLast = computed(() => {
    const pois = this.poisSignal();
    return pois.length === 0 || this.currentIndexSignal() >= pois.length - 1;
  });

  loadTour(tour: Tour, pois: Poi[]): void {
    this.tourSignal.set(tour);
    this.poisSignal.set(pois.slice().sort((a, b) => a.orderIndex - b.orderIndex));
    this.currentIndexSignal.set(0);
    this.visitedIdsSignal.set(new Set());
  }

  next(): void {
    const pois = this.poisSignal();
    if (pois.length === 0 || this.isLast()) {
      return;
    }
    const nextIndex = this.currentIndexSignal() + 1;
    this.setIndex(nextIndex);
  }

  previous(): void {
    if (this.isFirst()) {
      return;
    }
    const prevIndex = this.currentIndexSignal() - 1;
    this.setIndex(prevIndex);
  }

  selectById(id: string): void {
    const index = this.poisSignal().findIndex((p) => p.id === id);
    if (index === -1) {
      return;
    }
    this.setIndex(index);
  }

  private setIndex(index: number): void {
    const pois = this.poisSignal();
    if (index < 0 || index >= pois.length) {
      return;
    }
    this.currentIndexSignal.set(index);
    const visited = new Set(this.visitedIdsSignal());
    const current = pois[index];
    visited.add(current.id);
    this.visitedIdsSignal.set(visited);
  }
}


