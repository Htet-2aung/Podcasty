
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient'; // Import our Supabase client
import type { Session, User } from '@supabase/supabase-js';
import { Podcast, PlayerEpisode } from '../types';

interface UserContextType {
  session: Session | null;
  user: User | null;
  followedPodcasts: Podcast[];
  followPodcast: (podcast: Podcast) => void;
  unfollowPodcast: (podcastId: string) => void;
  isFollowing: (podcastId: string) => boolean;
  favoriteEpisodes: PlayerEpisode[];
  favoriteEpisode: (episode: PlayerEpisode) => void;
  unfavoriteEpisode: (episodeGuid: string) => void;
  isFavorite: (episodeGuid: string) => boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [followedPodcasts, setFollowedPodcasts] = useState<Podcast[]>([]);
  const [favoriteEpisodes, setFavoriteEpisodes] = useState<PlayerEpisode[]>([]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  // Persistence for followed podcasts
  useEffect(() => {
    const savedPodcasts = localStorage.getItem('followedPodcasts');
    if (savedPodcasts) {
      setFollowedPodcasts(JSON.parse(savedPodcasts));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('followedPodcasts', JSON.stringify(followedPodcasts));
  }, [followedPodcasts]);

  // Persistence for favorite episodes
  useEffect(() => {
    const savedEpisodes = localStorage.getItem('favoriteEpisodes');
    if (savedEpisodes) {
      setFavoriteEpisodes(JSON.parse(savedEpisodes));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('favoriteEpisodes', JSON.stringify(favoriteEpisodes));
  }, [favoriteEpisodes]);

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

  const favoriteEpisode = (episode: PlayerEpisode) => {
    if (!favoriteEpisodes.some(e => e.guid === episode.guid)) {
      setFavoriteEpisodes(prev => [...prev, episode]);
    }
  };

  const unfavoriteEpisode = (episodeGuid: string) => {
    setFavoriteEpisodes(prev => prev.filter(e => e.guid !== episodeGuid));
  };

  const isFavorite = (episodeGuid: string) => {
    return favoriteEpisodes.some(e => e.guid === episodeGuid);
  };

  const value = { 
    session, 
    user, 
    followedPodcasts, 
    followPodcast, 
    unfollowPodcast, 
    isFollowing,
    favoriteEpisodes,
    favoriteEpisode,
    unfavoriteEpisode,
    isFavorite
  };

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
