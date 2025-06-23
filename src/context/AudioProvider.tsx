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

export function AudioProvider({ children }: { children: ReactNode }) {
  const [currentEpisode, setCurrentEpisode] = useState<PlayerEpisode | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(new Audio());

  // This consolidated useEffect handles all audio playback logic.
  useEffect(() => {
    const audio = audioRef.current;
    
    // Check if the episode has changed and update the audio source
    if (currentEpisode && audio.src !== currentEpisode.audio) {
        audio.src = currentEpisode.audio;
    }
    
    // Handle play/pause based on the isPlaying state
    if (isPlaying) {
        audio.play().catch(e => {
            console.error("Audio play failed", e);
            setIsPlaying(false); // Reset state on failure
        });
    } else {
        audio.pause();
    }
  }, [currentEpisode, isPlaying]);

  // This useEffect sets up event listeners for time and duration updates.
  useEffect(() => {
    const audio = audioRef.current;
    const setAudioData = () => setDuration(audio.duration);
    const setAudioTime = () => setCurrentTime(audio.currentTime);

    audio.addEventListener('loadeddata', setAudioData);
    audio.addEventListener('timeupdate', setAudioTime);

    return () => {
      audio.removeEventListener('loadeddata', setAudioData);
      audio.removeEventListener('timeupdate', setAudioTime);
    };
  }, []); // Run only once

  const playEpisode = (episode: PlayerEpisode) => {
    if (currentEpisode?.guid !== episode.guid) {
      // If a new episode is selected, set it and start playing.
      setCurrentEpisode(episode);
      setIsPlaying(true);
    } else {
      // If the same episode is tapped, just toggle play/pause.
      togglePlayPause();
    }
  };

  const togglePlayPause = () => {
    if (currentEpisode) {
      setIsPlaying(prevIsPlaying => !prevIsPlaying);
    }
  };

  const value = { currentEpisode, playEpisode, isPlaying, togglePlayPause, isMaximized, setIsMaximized, audioRef, duration, currentTime };
  
  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>;
}

export const useAudioPlayer = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudioPlayer must be used within an AudioProvider');
  }
  return context;
};
