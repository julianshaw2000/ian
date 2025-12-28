import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { from, map, Observable } from 'rxjs';
import { Poi } from '../models/tour.models';

const SUPABASE_URL = 'https://vkllskiarxtcwedrwrys.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_LAhbVtMIVk4b861pyPZkiw_UQAO4Exp';

interface SupabasePoiRow {
  id: string;
  tour_id: string;
  order_index: number;
  lat: number;
  lng: number;
  title: string;
  address: string | null;
  description: string | null;
  audio_url: string | null;
  is_published: boolean;
  poi_media?: SupabasePoiMediaRow[];
}

interface SupabasePoiMediaRow {
  id: string;
  media_type: string;
  url: string;
  label: string | null;
  sort_order: number | null;
}

@Injectable({
  providedIn: 'root'
})
export class SupabasePoisService {
  private readonly client: SupabaseClient;

  constructor() {
    this.client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }

  /**
   * Load published POIs (and their media) for a tour and map them into the existing Poi model.
   */
  getPoisForTour(tourId: string): Observable<Poi[]> {
    return from(
      this.client
        .from('pois')
        .select(
          `
          id,
          tour_id,
          order_index,
          lat,
          lng,
          title,
          address,
          description,
          audio_url,
          is_published,
          poi_media (
            id,
            media_type,
            url,
            label,
            sort_order
          )
        `
        )
        .eq('tour_id', tourId)
        .eq('is_published', true)
        .order('order_index', { ascending: true })
    ).pipe(
      map(({ data, error }) => {
        if (error || !data) {
          return [];
        }

        const rows = data as unknown as SupabasePoiRow[];

        return rows.map((row) => {
          const media = (row.poi_media ?? []).slice().sort((a, b) => {
            const sa = a.sort_order ?? 0;
            const sb = b.sort_order ?? 0;
            return sa - sb;
          });

          const images = media.filter((m) => m.media_type === 'image').map((m) => m.url);

          return {
            id: row.id,
            tourId: row.tour_id,
            orderIndex: row.order_index,
            lat: row.lat,
            lng: row.lng,
            title: row.title,
            address: row.address ?? '',
            descriptionByLanguage: {
              en: row.description ?? '',
            },
            audioByLanguage: {
              en: row.audio_url ?? '',
            },
            images,
            optionalMedia: {},
          } as Poi;
        });
      })
    );
  }

  // === Admin helpers ===

  getPoisForTourAdmin(tourId: string): Observable<SupabasePoiRow[]> {
    return from(
      this.client
        .from('pois')
        .select('id, tour_id, order_index, lat, lng, title, address, description, audio_url, is_published')
        .eq('tour_id', tourId)
        .order('order_index', { ascending: true })
    ).pipe(
      map(({ data, error }) => {
        if (error || !data) {
          return [];
        }
        return data as unknown as SupabasePoiRow[];
      })
    );
  }

  async upsertPoi(row: SupabasePoiRow): Promise<{ error?: string }> {
    const { error } = await this.client.from('pois').upsert(row, { onConflict: 'id' });
    if (error) {
      return { error: error.message };
    }
    return {};
  }

  async deletePoi(id: string): Promise<{ error?: string }> {
    const { error } = await this.client.from('pois').delete().eq('id', id);
    if (error) {
      return { error: error.message };
    }
    return {};
  }

  // === POI media (admin) ===

  getMediaForPoiAdmin(poiId: string): Observable<SupabasePoiMediaRow[]> {
    return from(
      this.client
        .from('poi_media')
        .select('id, poi_id, media_type, url, label, sort_order')
        .eq('poi_id', poiId)
        .order('sort_order', { ascending: true })
    ).pipe(
      map(({ data, error }) => {
        if (error || !data) {
          return [];
        }
        return data as unknown as SupabasePoiMediaRow[];
      })
    );
  }

  async upsertMedia(
    poiId: string,
    payload: { id?: string; media_type: string; url: string; label?: string | null; sort_order?: number | null }
  ): Promise<{ error?: string }> {
    const row = {
      ...payload,
      poi_id: poiId
    };
    const { error } = await this.client.from('poi_media').upsert(row, { onConflict: 'id' });
    if (error) {
      return { error: error.message };
    }
    return {};
  }

  async deleteMedia(id: string): Promise<{ error?: string }> {
    const { error } = await this.client.from('poi_media').delete().eq('id', id);
    if (error) {
      return { error: error.message };
    }
    return {};
  }
}


