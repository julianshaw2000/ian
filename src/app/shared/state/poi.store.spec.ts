import { describe, it, expect, beforeEach } from 'vitest';
import { PoiStore } from './poi.store';
import { Poi, Tour } from '../models/tour.models';

describe('PoiStore', () => {
  let store: PoiStore;

  const tour: Tour = {
    id: 'test-tour',
    title: 'Test Tour',
    distanceKm: 1,
    durationMinutes: 10,
    price: '£0',
    languageOptions: ['en'],
    routeGeoJsonUrl: '/data/test-route.geojson',
    coverImages: []
  };

  const pois: Poi[] = [
    {
      id: 'a',
      tourId: 'test-tour',
      orderIndex: 1,
      lat: 0,
      lng: 0,
      title: 'A',
      address: 'Addr A',
      descriptionByLanguage: { en: 'A' },
      audioByLanguage: { en: '/audio/a.mp3' },
      images: []
    },
    {
      id: 'b',
      tourId: 'test-tour',
      orderIndex: 2,
      lat: 0,
      lng: 0,
      title: 'B',
      address: 'Addr B',
      descriptionByLanguage: { en: 'B' },
      audioByLanguage: { en: '/audio/b.mp3' },
      images: []
    }
  ];

  beforeEach(() => {
    store = new PoiStore();
    store.loadTour(tour, pois);
  });

  it('loads tour and pois and starts at first poi', () => {
    expect(store.tour()).toEqual(tour);
    expect(store.pois().length).toBe(2);
    expect(store.currentIndex()).toBe(0);
    expect(store.currentPoi()!.id).toBe('a');
  });

  it('advances to next poi and marks visited', () => {
    store.next();
    expect(store.currentIndex()).toBe(1);
    expect(store.currentPoi()!.id).toBe('b');
    expect(store.visitedIds().has('b')).toBe(true);
  });

  it('does not advance past last poi', () => {
    store.next();
    store.next();
    expect(store.currentIndex()).toBe(1);
  });

  it('moves backwards with previous()', () => {
    store.next();
    store.previous();
    expect(store.currentIndex()).toBe(0);
    expect(store.currentPoi()!.id).toBe('a');
  });

  it('selects poi by id', () => {
    store.selectById('b');
    expect(store.currentPoi()!.id).toBe('b');
  });
});


