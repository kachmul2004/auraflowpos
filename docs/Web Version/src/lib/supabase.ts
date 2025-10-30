import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

// Supabase configuration
// NOTE: These should be replaced with actual values from your Supabase project
// For now, we'll use placeholders and local fallback
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Initialize Supabase client
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

// Helper to check if Supabase is configured
export const isSupabaseConfigured = () => {
  return Boolean(supabase && supabaseUrl && supabaseAnonKey);
};

// Helper for error handling
export function handleSupabaseError(error: any) {
  console.error('Supabase error:', error);
  
  if (error?.message) {
    return error.message;
  }
  
  if (error?.error_description) {
    return error.error_description;
  }
  
  return 'An unexpected error occurred';
}

// Auth helpers
export const auth = {
  async signIn(email: string, password: string) {
    if (!supabase) throw new Error('Supabase not configured');
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw new Error(handleSupabaseError(error));
    return data;
  },

  async signUp(email: string, password: string, metadata?: any) {
    if (!supabase) throw new Error('Supabase not configured');
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    });
    
    if (error) throw new Error(handleSupabaseError(error));
    return data;
  },

  async signOut() {
    if (!supabase) throw new Error('Supabase not configured');
    
    const { error } = await supabase.auth.signOut();
    if (error) throw new Error(handleSupabaseError(error));
  },

  async getSession() {
    if (!supabase) return null;
    
    const { data } = await supabase.auth.getSession();
    return data.session;
  },

  async getUser() {
    if (!supabase) return null;
    
    const { data } = await supabase.auth.getUser();
    return data.user;
  },

  onAuthStateChange(callback: (event: string, session: any) => void) {
    if (!supabase) return { data: { subscription: { unsubscribe: () => {} } } };
    
    return supabase.auth.onAuthStateChange(callback);
  },
};

// Real-time subscriptions
export function subscribe(
  table: string,
  callback: (payload: any) => void,
  filter?: string
) {
  if (!supabase) {
    console.warn('Supabase not configured, subscriptions disabled');
    return null;
  }

  const channel = supabase
    .channel(`${table}_changes`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table,
        filter,
      },
      callback
    )
    .subscribe();

  return channel;
}

// Storage helpers
export const storage = {
  async uploadFile(bucket: string, path: string, file: File) {
    if (!supabase) throw new Error('Supabase not configured');
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        upsert: true,
      });
    
    if (error) throw new Error(handleSupabaseError(error));
    return data;
  },

  async deleteFile(bucket: string, path: string) {
    if (!supabase) throw new Error('Supabase not configured');
    
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);
    
    if (error) throw new Error(handleSupabaseError(error));
  },

  getPublicUrl(bucket: string, path: string) {
    if (!supabase) return '';
    
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);
    
    return data.publicUrl;
  },
};
