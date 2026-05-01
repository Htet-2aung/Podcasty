import { useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function MobileLogin() {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('sessionId');

    if (!sessionId) return;

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
  if (event === 'SIGNED_IN' && session?.refresh_token) {
    console.log("User signed in, attempting to save session...");
    
    const { error } = await supabase
      .from('mobile_auth_sessions')
      .insert([{ 
        session_id: sessionId, 
        refresh_token: session.refresh_token 
      }]);

    if (error) {
      // If this alert pops up on your phone browser, the DB rejected the write
      alert("Database Error: " + error.message);
      console.error(error);
    } else {
      document.body.innerHTML = '<h2>Login successful! Return to the app.</h2>';
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
