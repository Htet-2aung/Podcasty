// src/context/UserProvider.tsx

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { Session, User } from '@supabase/supabase-js';
import { Podcast, PlayerEpisode } from '../types';

interface UserContextType {
  session: Session | null;
  user: User | null;
  followedPodcasts: Podcast[];
  favoriteEpisodes: PlayerEpisode[];
  followPodcast: (podcast: Podcast) => void;
  unfollowPodcast: (podcastId: string) => void;
  isFollowing: (podcastId: string) => boolean;
  favoriteEpisode: (episode: PlayerEpisode) => void;
  unfavoriteEpisode: (episodeGuid: string) => void;
  isFavorite: (episodeGuid: string) => boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [followedPodcasts, setFollowedPodcasts] = useState<Podcast[]>([]);
  const [favoriteEpisodes, setFavoriteEpisodes] = useState<PlayerEpisode[]>([]);

  // Listen for auth changes to set user session
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Redundantly check the session initially to cover all cases
     supabase.auth.getSession().then(({ data: { session } }) => {
        if (!session) {
            setLoading(false);
        }
    })

    return () => subscription.unsubscribe();
  }, []);

  // Fetch library data from Supabase when the user logs in
  useEffect(() => {
    const fetchLibrary = async () => {
      if (!user) {
        setFollowedPodcasts([]);
        setFavoriteEpisodes([]);
        return;
      };

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

  const followPodcast = async (podcast: Podcast) => {
    if (!user) return;
    const { data, error } = await supabase
      .from('user_favorites')
      .insert({
        user_id: user.id,
        item_id: podcast.id,
        item_type: 'podcast',
        item_data: podcast,
      })
      .select();
    
    if (!error && data) {
      setFollowedPodcasts(prev => [...prev, podcast]);
    } else if (error) {
      console.error('Error following podcast:', error);
    }
  };

  const unfollowPodcast = async (podcastId: string) => {
    if (!user) return;
    const { error } = await supabase
      .from('user_favorites')
      .delete()
      .eq('user_id', user.id)
      .eq('item_id', podcastId);

    if (!error) {
      setFollowedPodcasts(prev => prev.filter(p => p.id !== podcastId));
    } else {
      console.error('Error unfollowing podcast:', error);
    }
  };

  const isFollowing = (podcastId: string) => followedPodcasts.some(p => p.id === podcastId);

  const favoriteEpisode = async (episode: PlayerEpisode) => {
    if (!user) return;
    const { data, error } = await supabase
      .from('user_favorites')
      .insert({
        user_id: user.id,
        item_id: episode.guid,
        item_type: 'episode',
        item_data: episode,
      })
      .select();

    if (!error && data) {
      setFavoriteEpisodes(prev => [...prev, episode]);
    } else if (error) {
      console.error('Error favoriting episode:', error);
    }
  };

  const unfavoriteEpisode = async (episodeGuid: string) => {
    if (!user) return;
    const { error } = await supabase
      .from('user_favorites')
      .delete()
      .eq('user_id', user.id)
      .eq('item_id', episodeGuid);

    if (!error) {
      setFavoriteEpisodes(prev => prev.filter(e => e.guid !== episodeGuid));
    } else {
      console.error('Error unfavoriting episode:', error);
    }
  };

  const isFavorite = (episodeGuid: string) => favoriteEpisodes.some(e => e.guid === episodeGuid);

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
