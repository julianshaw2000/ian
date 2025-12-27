export interface Tour {
  id: string;
  title: string;
  distanceKm: number;
  durationMinutes: number;
  price: string;
  languageOptions: string[];
  routeGeoJsonUrl: string;
  coverImages: string[];
}

export interface PoiDescriptionByLanguage {
  [languageCode: string]: string;
}

export interface PoiAudioByLanguage {
  [languageCode: string]: string;
}

export interface PoiOptionalMedia {
  musicUrl?: string;
  videoUrl?: string;
}

export interface Poi {
  id: string;
  tourId: string;
  orderIndex: number;
  lat: number;
  lng: number;
  title: string;
  address: string;
  descriptionByLanguage: PoiDescriptionByLanguage;
  audioByLanguage: PoiAudioByLanguage;
  images: string[];
  optionalMedia?: PoiOptionalMedia;
}


