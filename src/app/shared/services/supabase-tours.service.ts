import { Injectable } from '@angular/core';
import { from, map, Observable } from 'rxjs';
import { getSupabaseClient } from './supabase-client';

export interface SupabaseTour {
  id: string;
  title: string;
  location: string | null;
  distance_km: number | null;
  duration_minutes: number | null;
  price_cents: number | null;
  currency: string | null;
  route_url: string | null;
  cover_image_url: string | null;
  is_published: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class SupabaseToursService {
  private readonly client = getSupabaseClient();

  getPublishedTours(): Observable<SupabaseTour[]> {
    return from(
      this.client
        .from('tours')
        .select(
          'id, title, location, distance_km, duration_minutes, price_cents, currency, route_url, cover_image_url, is_published'
        )
        .eq('is_published', true)
        .order('created_at', { ascending: false })
    ).pipe(
      map(({ data, error }) => {
        if (error) {
          // In a real app we might log this to a monitoring service.
          // For now, fail closed by returning an empty list.
          return [];
        }
        return (data as SupabaseTour[]) ?? [];
      })
    );
  }

  getPublishedTourById(id: string): Observable<SupabaseTour | null> {
    return from(
      this.client
        .from('tours')
        .select(
          'id, title, location, distance_km, duration_minutes, price_cents, currency, route_url, cover_image_url, is_published'
        )
        .eq('id', id)
        .eq('is_published', true)
        .maybeSingle()
    ).pipe(
      map(({ data, error }) => {
        if (error) {
          return null;
        }
        return (data as SupabaseTour) ?? null;
      })
    );
  }

  getAllTours(): Observable<SupabaseTour[]> {
    return from(
      this.client
        .from('tours')
        .select(
          'id, title, location, distance_km, duration_minutes, price_cents, currency, route_url, cover_image_url, is_published'
        )
        .order('created_at', { ascending: false })
    ).pipe(
      map(({ data, error }) => {
        if (error) {
          return [];
        }
        return (data as SupabaseTour[]) ?? [];
      })
    );
  }

  async upsertTour(tour: SupabaseTour): Promise<{ error?: string }> {
    const { error } = await this.client.from('tours').upsert(tour, { onConflict: 'id' });
    if (error) {
      return { error: error.message };
    }
    return {};
  }

  async deleteTour(id: string): Promise<{ error?: string }> {
    const { error } = await this.client.from('tours').delete().eq('id', id);
    if (error) {
      return { error: error.message };
    }
    return {};
  }
}


