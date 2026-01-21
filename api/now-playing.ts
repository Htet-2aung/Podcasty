import { createClient } from '@supabase/supabase-js';

export const config = {
  runtime: 'edge',
};

export default async function handler(request: Request) {
  // 1. Setup Supabase Client
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return new Response(JSON.stringify({ error: 'Missing env vars' }), { status: 500 });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  // 2. Handle CORS (So your portfolio can read this)
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers });
  }

  try {
    // 3. Fetch Data
    const { data, error } = await supabase
      .from('now_playing')
      .select('*')
      .eq('id', 1)
      .single();

    if (error || !data) {
      return new Response(JSON.stringify({ isPlaying: false }), { status: 200, headers });
    }

    // 4. Logic: Check if update was recent (20 mins)
    const lastUpdate = new Date(data.updated_at).getTime();
    const now = new Date().getTime();
    const isRecent = (now - lastUpdate) < 1000 * 60 * 20;

    const responseData = {
      isPlaying: data.is_playing && isRecent,
      title: data.title,
      artist: data.artist,
      albumArt: data.album_art,
      link: data.link || "https://podcasty-two.vercel.app"
    };

    return new Response(JSON.stringify(responseData), { status: 200, headers });

  } catch (error) {
    return new Response(JSON.stringify({ isPlaying: false }), { status: 500, headers });
  }
}
