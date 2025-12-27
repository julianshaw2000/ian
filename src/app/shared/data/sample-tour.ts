import { Poi, Tour } from '../models/tour.models';

export const LONDON_TOUR_ID = 'london-vivid-history';
export const BRIXTON_TOUR_ID = 'brixton-vivid-history';

export const LONDON_TOUR: Tour = {
  id: LONDON_TOUR_ID,
  title: 'Vivid History: London Walking Tour',
  distanceKm: 4.2,
  durationMinutes: 90,
  price: '£9.99',
  languageOptions: ['en'],
  routeGeoJsonUrl: '/data/london-vivid-history-route.geojson',
  coverImages: [
    '/assets/london/london-cover-1.jpg',
    '/assets/london/london-cover-2.jpg'
  ]
};

export const LONDON_POIS: Poi[] = [
  {
    id: 'poi-1-westminster',
    tourId: LONDON_TOUR_ID,
    orderIndex: 1,
    lat: 51.5007,
    lng: -0.1246,
    title: 'Westminster Bridge',
    address: 'Westminster Bridge Rd, London SE1 7PB',
    descriptionByLanguage: {
      en: 'Start your walk with sweeping views of the Thames, Big Ben, and the Houses of Parliament.'
    },
    audioByLanguage: {
      en: '/audio/london/westminster-intro.mp3'
    },
    images: [
      '/assets/london/westminster-1.jpg',
      '/assets/london/westminster-2.jpg'
    ]
  },
  {
    id: 'poi-2-parliament',
    tourId: LONDON_TOUR_ID,
    orderIndex: 2,
    lat: 51.4995,
    lng: -0.1248,
    title: 'Houses of Parliament',
    address: 'Westminster, London SW1A 0AA',
    descriptionByLanguage: {
      en: 'Walk along the Palace of Westminster as you hear how it survived fires, plots, and wars.'
    },
    audioByLanguage: {
      en: '/audio/london/parliament.mp3'
    },
    images: [
      '/assets/london/parliament-1.jpg',
      '/assets/london/parliament-2.jpg'
    ]
  },
  {
    id: 'poi-3-whitehall',
    tourId: LONDON_TOUR_ID,
    orderIndex: 3,
    lat: 51.5034,
    lng: -0.1276,
    title: 'Whitehall & Cenotaph',
    address: 'Whitehall, London SW1A 2ET',
    descriptionByLanguage: {
      en: 'Follow the spine of British power, where royal processions and protests share the same street.'
    },
    audioByLanguage: {
      en: '/audio/london/whitehall.mp3'
    },
    images: [
      '/assets/london/whitehall-1.jpg'
    ]
  },
  {
    id: 'poi-4-trafalgar',
    tourId: LONDON_TOUR_ID,
    orderIndex: 4,
    lat: 51.5080,
    lng: -0.1281,
    title: 'Trafalgar Square',
    address: 'Trafalgar Sq, London WC2N 5DN',
    descriptionByLanguage: {
      en: 'Stand beneath Nelson’s Column as stories of empire, art, and protest unfold around you.'
    },
    audioByLanguage: {
      en: '/audio/london/trafalgar.mp3'
    },
    images: [
      '/assets/london/trafalgar-1.jpg',
      '/assets/london/trafalgar-2.jpg'
    ]
  },
  {
    id: 'poi-5-covent-garden',
    tourId: LONDON_TOUR_ID,
    orderIndex: 5,
    lat: 51.5119,
    lng: -0.1230,
    title: 'Covent Garden',
    address: 'Covent Garden, London WC2E 8RD',
    descriptionByLanguage: {
      en: 'Slip into the old fruit and flower market, now filled with street performers and hidden courtyards.'
    },
    audioByLanguage: {
      en: '/audio/london/covent-garden.mp3'
    },
    images: [
      '/assets/london/covent-1.jpg'
    ],
    optionalMedia: {
      musicUrl: '/audio/london/covent-garden-music.mp3'
    }
  },
  {
    id: 'poi-6-seveno-dials',
    tourId: LONDON_TOUR_ID,
    orderIndex: 6,
    lat: 51.5136,
    lng: -0.1277,
    title: 'Seven Dials',
    address: 'Seven Dials, London WC2H 9HD',
    descriptionByLanguage: {
      en: 'End the tour in a tangle of narrow streets where Victorian vice met modern theatre.'
    },
    audioByLanguage: {
      en: '/audio/london/seven-dials.mp3'
    },
    images: [
      '/assets/london/seven-dials-1.jpg'
    ],
    optionalMedia: {
      videoUrl: 'https://example.com/video/seven-dials'
    }
  }
];

export const BRIXTON_TOUR: Tour = {
  id: BRIXTON_TOUR_ID,
  title: 'Vivid History: Brixton Walking Tour',
  distanceKm: 3.1,
  durationMinutes: 75,
  price: '£7.99',
  languageOptions: ['en'],
  routeGeoJsonUrl: '/data/brixton-vivid-history-route.geojson',
  coverImages: [
    '/assets/brixton/brixton-cover-1.jpg'
  ]
};

export const BRIXTON_POIS: Poi[] = [
  {
    id: 'brixton-1-station',
    tourId: BRIXTON_TOUR_ID,
    orderIndex: 1,
    lat: 51.4626,
    lng: -0.1140,
    title: 'Brixton Station Road',
    address: 'Brixton Station Rd, London SW9',
    descriptionByLanguage: {
      en: 'Begin at the beating heart of Brixton, where market stalls and railway arches frame the arrival into south London.'
    },
    audioByLanguage: {
      en: '/audio/brixton/station-road.mp3'
    },
    images: ['/assets/brixton/station-road-1.jpg']
  },
  {
    id: 'brixton-2-arcade',
    tourId: BRIXTON_TOUR_ID,
    orderIndex: 2,
    lat: 51.4621,
    lng: -0.1120,
    title: 'Brixton Village & Market Row',
    address: 'Coldharbour Ln, London SW9 8PS',
    descriptionByLanguage: {
      en: 'Step into covered arcades filled with Afro-Caribbean food, independent shops, and the stories of migration that reshaped Brixton.'
    },
    audioByLanguage: {
      en: '/audio/brixton/village.mp3'
    },
    images: ['/assets/brixton/village-1.jpg']
  },
  {
    id: 'brixton-3-windrush',
    tourId: BRIXTON_TOUR_ID,
    orderIndex: 3,
    lat: 51.4635,
    lng: -0.1127,
    title: 'Windrush Square',
    address: 'Windrush Sq, London SW2 1EF',
    descriptionByLanguage: {
      en: 'Pause in Windrush Square to hear how post-war arrivals from the Caribbean turned Brixton into the capital of Black Britain.'
    },
    audioByLanguage: {
      en: '/audio/brixton/windrush-square.mp3'
    },
    images: ['/assets/brixton/windrush-1.jpg']
  },
  {
    id: 'brixton-4-library',
    tourId: BRIXTON_TOUR_ID,
    orderIndex: 4,
    lat: 51.4629,
    lng: -0.1125,
    title: 'Brixton Library & Tate Gardens',
    address: 'Brixton Oval, London SW2 1JQ',
    descriptionByLanguage: {
      en: 'Stand by the library and gardens to explore how protest, poetry, and politics have collided on this busy corner.'
    },
    audioByLanguage: {
      en: '/audio/brixton/library.mp3'
    },
    images: ['/assets/brixton/library-1.jpg']
  },
  {
    id: 'brixton-5-rialto',
    tourId: BRIXTON_TOUR_ID,
    orderIndex: 5,
    lat: 51.4615,
    lng: -0.1121,
    title: 'Electric Avenue & The Ritzy',
    address: 'Coldharbour Ln, London SW2 1JG',
    descriptionByLanguage: {
      en: 'Walk along Electric Avenue and past the Ritzy cinema, where music, film, and nightlife keep Brixton glowing after dark.'
    },
    audioByLanguage: {
      en: '/audio/brixton/electric-avenue.mp3'
    },
    images: ['/assets/brixton/electric-1.jpg']
  }
];

export const ALL_TOURS: Tour[] = [LONDON_TOUR, BRIXTON_TOUR];

export function getTourById(id: string): Tour | undefined {
  return ALL_TOURS.find((t) => t.id === id);
}

export function getPoisForTour(id: string): Poi[] {
  if (id === LONDON_TOUR_ID) {
    return LONDON_POIS;
  }
  if (id === BRIXTON_TOUR_ID) {
    return BRIXTON_POIS;
  }
  return [];
}



