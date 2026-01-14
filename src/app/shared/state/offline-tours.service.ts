import { Injectable } from '@angular/core';
import { ALL_TOURS, BRIXTON_POIS, LONDON_POIS } from '../data/sample-tour';
import type { Tour, Poi } from '../models/tour.models';

const DB_NAME = 'city-history';
const DB_VERSION = 1;
const TOURS_STORE = 'tours';
const POIS_STORE = 'pois';

@Injectable({
  providedIn: 'root',
})
export class OfflineToursService {
  init(): void {
    if (typeof indexedDB === 'undefined') {
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(TOURS_STORE)) {
        db.createObjectStore(TOURS_STORE, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(POIS_STORE)) {
        const store = db.createObjectStore(POIS_STORE, { keyPath: 'id' });
        if (!store.indexNames.contains('tourId')) {
          store.createIndex('tourId', 'tourId', { unique: false });
        }
      }
    };

    request.onsuccess = () => {
      const db = request.result;
      this.seedTours(db, ALL_TOURS);
      this.seedPois(db, [...LONDON_POIS, ...BRIXTON_POIS]);
    };

    request.onerror = () => {
      // Best-effort only; ignore failures.
    };
  }

  private seedTours(db: IDBDatabase, tours: Tour[]): void {
    const tx = db.transaction(TOURS_STORE, 'readwrite');
    const store = tx.objectStore(TOURS_STORE);
    tours.forEach((tour) => store.put(tour));
  }

  private seedPois(db: IDBDatabase, pois: Poi[]): void {
    const tx = db.transaction(POIS_STORE, 'readwrite');
    const store = tx.objectStore(POIS_STORE);
    pois.forEach((poi) => store.put(poi));
  }
}
