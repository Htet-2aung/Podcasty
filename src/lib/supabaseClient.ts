// src/lib/supabaseClient.ts

import { createClient } from '@supabase/supabase-js'

// IMPORTANT: Replace these with your actual Supabase URL and Key!
const supabaseUrl = 'https://kdpdfzeeydpbshsdglup.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtkcGRmemVleWRwYnNoc2RnbHVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3OTQ0ODksImV4cCI6MjA2NTM3MDQ4OX0.U-ShtRG9xjWDIDhNmjbtlJUQPYcmhdCyu3P2TDZdq-g'

// This creates the Supabase client instance that you'll use throughout your app
export const supabase = createClient(supabaseUrl, supabaseAnonKey)