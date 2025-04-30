
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase'; // Corrected path

// Read Supabase URL and Anon Key from environment variables (Vite convention)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Basic validation to ensure environment variables are set
if (!supabaseUrl) {
  throw new Error("VITE_SUPABASE_URL is not set. Please check your .env file or environment variables.");
}
if (!supabaseAnonKey) {
  throw new Error("VITE_SUPABASE_ANON_KEY is not set. Please check your .env file or environment variables.");
}

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

// Initialize the Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
