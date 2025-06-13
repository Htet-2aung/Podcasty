// ▶️ FILE: src/components/AudioPlayer.tsx
// The floating audio player component.
// =======================================================================
import React from 'react';
import { PlayerEpisode } from '../types';
import { Play, Pause } from 'lucide-react';

interface AudioPlayerProps {
  episode: PlayerEpisode;
  isPlaying: boolean;
  onPlayPause: () => void;
  audioRef: React.RefObject<HTMLAudioElement>;
}

export default function AudioPlayer({ episode, isPlaying, onPlayPause }: AudioPlayerProps) {
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[95%] max-w-4xl z-50">
      <div className="bg-overlay/50 p-3 rounded-xl shadow-2xl shadow-black/50 ring-1 ring-white/10 backdrop-blur-lg">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <img src={episode.image} alt={episode.title} className="w-14 h-14 rounded-md object-cover" />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold truncate text-text-main">{episode.title}</h3>
              <p className="text-sm text-text-secondary truncate">{episode.podcastTitle}</p>
            </div>
          </div>
          <button
            onClick={onPlayPause}
            className="bg-primary text-white rounded-full w-12 h-12 flex items-center justify-center text-3xl shrink-0 transition-transform hover:scale-110 active:scale-95"
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
          </button>
        </div>
      </div>
    </div>
  );
}
