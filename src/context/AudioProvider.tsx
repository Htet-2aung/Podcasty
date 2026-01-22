import React, { createContext, useState, useContext, ReactNode, useRef, useEffect } from 'react';
import { PlayerEpisode } from '../types';
import { supabase } from '../lib/supabaseClient';

interface AudioContextType {
  currentEpisode: PlayerEpisode | null;
  playEpisode: (episode: PlayerEpisode, playlist?: PlayerEpisode[]) => void;
  togglePlayPause: () => void;
  playNext: () => void;
  playPrevious: () => void;
  isPlaying: boolean;
  isMaximized: boolean;
  setIsMaximized: React.Dispatch<React.SetStateAction<boolean>>;
  audioRef: React.RefObject<HTMLAudioElement>;
  duration: number;
  currentTime: number;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: ReactNode }) {
  const [currentEpisode, setCurrentEpisode] = useState<PlayerEpisode | null>(null);
  const [playlist, setPlaylist] = useState<PlayerEpisode[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(new Audio());

  
  useEffect(() => {
    const audio = audioRef.current;
    if (currentEpisode && audio.src !== currentEpisode.audio) {
      audio.src = currentEpisode.audio;
    }
    if (isPlaying) {
      audio.play().catch(e => {
        console.error("Audio play failed", e);
        setIsPlaying(false);
      });
    } else {
      audio.pause();
    }
  }, [currentEpisode, isPlaying]);

  useEffect(() => {
  const updateNowPlaying = async () => {
    if (!currentEpisode) return;

    const { error } = await supabase
      .from('now_playing')
      .update({
        is_playing: isPlaying,
        title: currentEpisode.title,
        artist: currentEpisode.author || "Podcasty", 
        album_art: currentEpisode.image,
        link: "https://podcasty-two.vercel.app",
        updated_at: new Date().toISOString()
      })
      .eq('id', 1);

    if (error) console.error("Sync Error:", error);
  };

  updateNowPlaying();
}, [currentEpisode, isPlaying]);
  
  useEffect(() => {
    const audio = audioRef.current;
    const setAudioData = () => setDuration(audio.duration);
    const setAudioTime = () => setCurrentTime(audio.currentTime);

    audio.addEventListener('ended', () => playNext());
    audio.addEventListener('loadeddata', setAudioData);
    audio.addEventListener('timeupdate', setAudioTime);

    return () => {
      audio.removeEventListener('ended', () => playNext());
      audio.removeEventListener('loadeddata', setAudioData);
      audio.removeEventListener('timeupdate', setAudioTime);
    };
  }, [playlist, currentEpisode]); // Re-add listener if playlist changes

  const playEpisode = (episode: PlayerEpisode, newPlaylist: PlayerEpisode[] = []) => {
    if (newPlaylist.length > 0) {
      setPlaylist(newPlaylist);
    }
    if (currentEpisode?.guid !== episode.guid) {
      setCurrentEpisode(episode);
      setIsPlaying(true);
    } else {
      togglePlayPause();
    }
  };

  const togglePlayPause = () => {
    if (currentEpisode) {
      setIsPlaying(prev => !prev);
    }
  };

  const playNext = () => {
    if (!currentEpisode || playlist.length === 0) return;
    const currentIndex = playlist.findIndex(ep => ep.guid === currentEpisode.guid);
    if (currentIndex > -1 && currentIndex < playlist.length - 1) {
      const nextEpisode = playlist[currentIndex + 1];
      setCurrentEpisode(nextEpisode);
      setIsPlaying(true);
    } else {
      setIsPlaying(false); // Stop playing at the end of the playlist
    }
  };

  const playPrevious = () => {
    if (!currentEpisode || playlist.length === 0) return;
    const currentIndex = playlist.findIndex(ep => ep.guid === currentEpisode.guid);
    if (currentIndex > 0) {
      const prevEpisode = playlist[currentIndex - 1];
      setCurrentEpisode(prevEpisode);
      setIsPlaying(true);
    }
  };

  const value = {
    currentEpisode,
    playEpisode,
    isPlaying,
    togglePlayPause,
    playNext,
    playPrevious,
    isMaximized,
    setIsMaximized,
    audioRef,
    duration,
    currentTime
  };

  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>;
}

export const useAudioPlayer = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudioPlayer must be used within an AudioProvider');
  }
  return context;
};



