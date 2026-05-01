import { useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function MobileLogin() {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('sessionId');

    if (!sessionId) return;

   const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
  console.log("Current Auth Event:", event); // Debugging: See what event triggers

  // Check for session existence regardless of the specific event name
  if (session?.refresh_token) {
    const { error } = await supabase
      .from('mobile_auth_sessions')
      .insert([{ 
        session_id: sessionId, 
        refresh_token: session.refresh_token 
      }]);

    if (error) {
      alert("Database Write Failed: " + error.message);
    } else {
      document.body.innerHTML = '<h2>Success! Closing...</h2>';
    }
  }
});

    return () => { authListener.subscription.unsubscribe(); };
  }, []);

  return (
    <div>
      <h1>Log in to Podcasty</h1>
      <button onClick={() => supabase.auth.signInWithOAuth({ provider: 'google' })}>
        Continue with Google
      </button>
    </div>
  );
}
