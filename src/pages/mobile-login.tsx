import { useEffect, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function MobileLogin() {
  // Use a ref to ensure we only write to the database once per session
  const processed = useRef(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('sessionId');

    if (!sessionId) return;

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth Event:", event);

      if (session?.refresh_token && !processed.current) {
        processed.current = true; // Block further attempts
        
        const { error } = await supabase
          .from('mobile_auth_sessions')
          .insert([{ 
            session_id: sessionId, 
            refresh_token: session.refresh_token 
          }]);

        if (error) {
          console.error("Insert error:", error);
          // If write fails, reset the flag so user can try again
          processed.current = false;
          alert("Database Write Failed: " + error.message);
        } else {
          document.body.innerHTML = `
            <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;">
              <h2 style="color:#10b981;">Login successful!</h2>
              <p>You can return to the app now.</p>
            </div>
          `;
        }
      }
    });

    return () => { authListener.subscription.unsubscribe(); };
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', fontFamily: 'sans-serif' }}>
      <h1>Log in to Podcasty</h1>
      <button 
        style={{ padding: '12px 24px', backgroundColor: '#000', color: '#fff', borderRadius: '8px', border: 'none', cursor: 'pointer' }}
        onClick={() => supabase.auth.signInWithOAuth({ provider: 'google' })}
      >
        Continue with Google
      </button>
    </div>
  );
}
