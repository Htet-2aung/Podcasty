import { createClient } from '@supabase/supabase-js'

// --- TEMPORARY DEBUGGING ---
// We are hardcoding the keys to prove the issue is with Vercel's environment variables.
// The original code is commented out below.
const supabaseUrl = "https://kdpdfzeeydpbshsdglup.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtkcGRmemVleWRwYnNoc2RnbHVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3OTQ0ODksImV4cCI6MjA2NTM3MDQ4OX0.U-ShtRG9xjWDIDhNmjbtlJUQPYcmhdCyu3P2TDZdq-g"

/*
// This is the original, correct code that should be used once Vercel settings are fixed.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL and Anon Key must be defined in your .env file");
}
*/

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
