import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://vkllskiarxtcwedrwrys.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_LAhbVtMIVk4b861pyPZkiw_UQAO4Exp';

// Buckets must exist in Supabase:
// - cityhistorywalks-media: for images and audio
// - cityhistorywalks-routes: for GeoJSON route files
const MEDIA_BUCKET = 'cityhistorywalks-media';
const ROUTES_BUCKET = 'cityhistorywalks-routes';

@Injectable({
  providedIn: 'root'
})
export class SupabaseMediaService {
  private readonly client: SupabaseClient;

  constructor() {
    this.client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }

  async uploadTourCoverImage(tourId: string, file: File): Promise<{ url?: string; error?: string }> {
    const path = `tours/${tourId}/cover/${Date.now()}-${file.name}`;
    return this.uploadAndGetPublicUrl(MEDIA_BUCKET, path, file);
  }

  async uploadTourRouteGeoJson(tourId: string, file: File): Promise<{ url?: string; error?: string }> {
    const path = `tours/${tourId}/routes/${Date.now()}-${file.name}`;
    return this.uploadAndGetPublicUrl(ROUTES_BUCKET, path, file);
  }

  async uploadPoiAudio(tourId: string, poiId: string, file: File): Promise<{ url?: string; error?: string }> {
    const path = `tours/${tourId}/pois/${poiId}/audio/${Date.now()}-${file.name}`;
    return this.uploadAndGetPublicUrl(MEDIA_BUCKET, path, file);
  }

  private async uploadAndGetPublicUrl(
    bucket: string,
    path: string,
    file: File
  ): Promise<{ url?: string; error?: string }> {
    const { error: uploadError } = await this.client.storage.from(bucket).upload(path, file, {
      upsert: false
    });
    if (uploadError) {
      return { error: uploadError.message };
    }

    const { data } = this.client.storage.from(bucket).getPublicUrl(path);
    return { url: data.publicUrl };
  }
}


