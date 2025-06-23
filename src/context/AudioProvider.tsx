import React, { createContext, useState, useContext, ReactNode, useRef, useEffect } from 'react';
import { PlayerEpisode } from '../types';


interface AudioContextType {
  currentEpisode: PlayerEpisode | null;
  playEpisode: (episode: PlayerEpisode) => void;
  togglePlayPause: () => void;
  isPlaying: boolean;
  isMaximized: boolean;
  setIsMaximized: React.Dispatch<React.SetStateAction<boolean>>;
  audioRef: React.RefObject<HTMLAudioElement>;
  duration: number;
  currentTime: number;
}
const AudioContext = createContext<AudioContextType | undefined>(undefined);

// Add the 'export' keyword here
export function AudioProvider({ children }: { children: ReactNode }) {
  const [currentEpisode, setCurrentEpisode] = useState<PlayerEpisode | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  // It's better to initialize the Audio object inside a useEffect or useRef initializer to avoid re-creation on re-renders.
  // The current implementation is okay, but `new Audio()` will be called on every render.
  const audioRef = useRef<HTMLAudioElement>(new Audio());

  useEffect(() => {
    const audio = audioRef.current;
    const setAudioData = () => setDuration(audio.duration);
    const setAudioTime = () => setCurrentTime(audio.currentTime);
    audio.addEventListener('loadeddata', setAudioData);
    audio.addEventListener('timeupdate', setAudioTime);

    if (currentEpisode) {
        if (isPlaying) {
            audio.play().catch(e => console.error("Audio play failed", e));
        } else {
            audio.pause();
        }
    }

    return () => {
      audio.removeEventListener('loadeddata', setAudioData);
      audio.removeEventListener('timeupdate', setAudioTime);
    }
    // Dependency array should include currentEpisode
  }, [isPlaying, currentEpisode]);

  useEffect(() => {
    if (currentEpisode) {
      audioRef.current.src = currentEpisode.audio;
      setIsPlaying(true); // Autoplay when a new episode is selected
    } else {
        setIsPlaying(false);
    }
  }, [currentEpisode]);
  
  const playEpisode = (episode: PlayerEpisode) => {
    // BUG FIX: Compare episodes by guid, not id.
    if (currentEpisode?.guid !== episode.guid) {
        setCurrentEpisode(episode);
    } else {
        togglePlayPause();
    }
  };

  const togglePlayPause = () => {
    if (currentEpisode) {
        setIsPlaying(!isPlaying);
    }
  };

  const value = { currentEpisode, playEpisode, isPlaying, togglePlayPause, isMaximized, setIsMaximized, audioRef, duration, currentTime };
  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>;
}

// And also export the hook
export const useAudioPlayer = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudioPlayer must be used within an AudioProvider');
  }
  return context;
};
