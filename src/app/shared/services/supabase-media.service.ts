import { Injectable } from '@angular/core';
import { getSupabaseClient } from './supabase-client';

// Buckets must exist in Supabase:
// - cityhistorywalks-media: for images and audio
// - cityhistorywalks-routes: for GeoJSON route files
const MEDIA_BUCKET = 'cityhistorywalks-media';
const ROUTES_BUCKET = 'cityhistorywalks-routes';

@Injectable({
  providedIn: 'root'
})
export class SupabaseMediaService {
  private readonly client = getSupabaseClient();

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

  async uploadPoiImage(
    tourId: string,
    poiId: string,
    file: File
  ): Promise<{ url?: string; error?: string }> {
    const path = `tours/${tourId}/pois/${poiId}/images/${Date.now()}-${file.name}`;
    return this.uploadAndGetPublicUrl(MEDIA_BUCKET, path, file);
  }

  async uploadPoiVideo(
    tourId: string,
    poiId: string,
    file: File
  ): Promise<{ url?: string; error?: string }> {
    const path = `tours/${tourId}/pois/${poiId}/video/${Date.now()}-${file.name}`;
    return this.uploadAndGetPublicUrl(MEDIA_BUCKET, path, file);
  }

  async deleteMediaObject(bucket: string, path: string): Promise<{ error?: string }> {
    const { error } = await this.client.storage.from(bucket).remove([path]);
    if (error) {
      return { error: error.message };
    }
    return {};
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


