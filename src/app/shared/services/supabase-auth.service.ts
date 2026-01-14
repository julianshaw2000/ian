import { Injectable, computed, signal } from '@angular/core';
import { createClient, Session, SupabaseClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://vkllskiarxtcwedrwrys.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_LAhbVtMIVk4b861pyPZkiw_UQAO4Exp';

@Injectable({
  providedIn: 'root'
})
export class SupabaseAuthService {
  private readonly client: SupabaseClient;
  private readonly _session = signal<Session | null>(null);

  // Expose readonly signals for templates/components
  readonly session = this._session.asReadonly();
  readonly userEmail = computed(() => this._session()?.user?.email ?? null);

  constructor() {
    this.client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // Bootstrap session from persisted auth state and subscribe to changes
    void this.bootstrapSession();
  }

  private async bootstrapSession(): Promise<void> {
    const { data } = await this.client.auth.getSession();
    this._session.set(data.session ?? null);

    this.client.auth.onAuthStateChange((_event, session) => {
      this._session.set(session);
    });
  }

  async signInWithPassword(email: string, password: string): Promise<{ error?: string }> {
    const { data, error } = await this.client.auth.signInWithPassword({ email, password });
    if (error) {
      return { error: error.message };
    }

    this._session.set(data.session ?? null);
    return {};
  }

  async signInWithGoogle(): Promise<{ error?: string }> {
    const { error } = await this.client.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/admin/dashboard`
      }
    });
    if (error) {
      return { error: error.message };
    }
    return {};
  }

  async signOut(): Promise<void> {
    await this.client.auth.signOut();
    this._session.set(null);
  }

  async getSession(): Promise<Session | null> {
    const { data, error } = await this.client.auth.getSession();
    if (error) {
      return null;
    }
    this._session.set(data.session ?? null);
    return data.session ?? null;
  }

  async updatePassword(newPassword: string): Promise<{ error?: string }> {
    const { error } = await this.client.auth.updateUser({ password: newPassword });
    if (error) {
      return { error: error.message };
    }
    return {};
  }
}


