// src/context/UserProvider.tsx

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { Session, User } from '@supabase/supabase-js';
import { Podcast, PlayerEpisode } from '../types';

// ... (interface definition remains the same)

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // This now correctly represents the INITIAL auth check
  const [followedPodcasts, setFollowedPodcasts] = useState<Podcast[]>([]);
  const [favoriteEpisodes, setFavoriteEpisodes] = useState<PlayerEpisode[]>([]);

  // Listen for auth changes to set user session
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      // --- FIX: This is the crucial change ---
      // Set loading to false once the auth state is known.
      setLoading(false);
    });

    // Also check the initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
        if (!session) {
            setLoading(false);
        }
    })


    return () => subscription.unsubscribe();
  }, []);

  // Fetch library data from Supabase when the user logs in
  useEffect(() => {
    // This effect should only fetch data and not control the main loading state.
    const fetchLibrary = async () => {
      if (!user) {
        // Clear data on logout
        setFollowedPodcasts([]);
        setFavoriteEpisodes([]);
        return;
      }
      
      const { data, error } = await supabase
        .from('user_favorites')
        .select('item_id, item_type, item_data')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error fetching user library:', error);
      } else if (data) {
        const podcasts = data
          .filter(item => item.item_type === 'podcast')
          .map(item => item.item_data as Podcast);
        const episodes = data
          .filter(item => item.item_type === 'episode')
          .map(item => item.item_data as PlayerEpisode);
        
        setFollowedPodcasts(podcasts);
        setFavoriteEpisodes(episodes);
      }
    };

    fetchLibrary();
  }, [user]);

  // ... (rest of the file remains the same)
  const value = {
    session,
    user,
    followedPodcasts,
    favoriteEpisodes,
    followPodcast,
    unfollowPodcast,
    isFollowing,
    favoriteEpisode,
    unfavoriteEpisode,
    isFavorite,
  };

  return (
    <UserContext.Provider value={value}>
      {!loading && children}
    </UserContext.Provider>
  );
}

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
