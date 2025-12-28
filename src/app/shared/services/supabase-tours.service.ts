import { Injectable, inject } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { from, map, Observable } from 'rxjs';

export interface SupabaseTour {
  id: string;
  title: string;
  location: string | null;
  distance_km: number | null;
  duration_minutes: number | null;
  price_cents: number | null;
  currency: string | null;
  route_url: string | null;
  is_published: boolean;
}

const SUPABASE_URL = 'https://vkllskiarxtcwedrwrys.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_LAhbVtMIVk4b861pyPZkiw_UQAO4Exp';

@Injectable({
  providedIn: 'root'
})
export class SupabaseToursService {
  private readonly client: SupabaseClient;

  constructor() {
    this.client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }

  getPublishedTours(): Observable<SupabaseTour[]> {
    return from(
      this.client
        .from('tours')
        .select(
          'id, title, location, distance_km, duration_minutes, price_cents, currency, route_url, is_published'
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
          'id, title, location, distance_km, duration_minutes, price_cents, currency, route_url, is_published'
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
}


