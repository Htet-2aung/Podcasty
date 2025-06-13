// src/context/UserProvider.tsx

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient'; // Import our Supabase client
import type { Session, User } from '@supabase/supabase-js';
import { Podcast } from '../types';

interface UserContextType {
  session: Session | null;
  user: User | null;
  followedPodcasts: Podcast[];
  followPodcast: (podcast: Podcast) => void;
  unfollowPodcast: (podcastId: string) => void;
  isFollowing: (podcastId: string) => boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [followedPodcasts, setFollowedPodcasts] = useState<Podcast[]>([]);

  useEffect(() => {
    // This is the most important part:
    // It fetches the initial session and listens for any changes.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    // Clean up the subscription when the component unmounts
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  // Note: For a full production app, this followed list would be saved
  // to your Supabase database, not localStorage. But for now, this works.
  useEffect(() => {
    const savedPodcasts = localStorage.getItem('followedPodcasts');
    if (savedPodcasts) {
      setFollowedPodcasts(JSON.parse(savedPodcasts));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('followedPodcasts', JSON.stringify(followedPodcasts));
  }, [followedPodcasts]);

  const followPodcast = (podcast: Podcast) => {
    if (!followedPodcasts.some(p => p.id === podcast.id)) {
      setFollowedPodcasts(prev => [...prev, podcast]);
    }
  };

  const unfollowPodcast = (podcastId: string) => {
    setFollowedPodcasts(prev => prev.filter(p => p.id !== podcastId));
  };

  const isFollowing = (podcastId: string) => {
    return followedPodcasts.some(p => p.id === podcastId);
  };

  const value = { session, user, followedPodcasts, followPodcast, unfollowPodcast, isFollowing };

  return (
    <UserContext.Provider value={value}>
      {children}
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