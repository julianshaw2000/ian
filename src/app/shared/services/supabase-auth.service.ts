import { Injectable } from '@angular/core';
import { createClient, Session, SupabaseClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://vkllskiarxtcwedrwrys.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_LAhbVtMIVk4b861pyPZkiw_UQAO4Exp';

@Injectable({
  providedIn: 'root'
})
export class SupabaseAuthService {
  private readonly client: SupabaseClient;

  constructor() {
    this.client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }

  async signInWithPassword(email: string, password: string): Promise<{ error?: string }> {
    const { error } = await this.client.auth.signInWithPassword({ email, password });
    if (error) {
      return { error: error.message };
    }
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
  }

  async getSession(): Promise<Session | null> {
    const { data, error } = await this.client.auth.getSession();
    if (error) {
      return null;
    }
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


