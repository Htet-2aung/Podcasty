import { useAudioPlayer as useAudioPlayerNowPlaying } from "../context/AudioProvider";
import { ChevronDown, Play, Pause, Rewind, FastForward, Speaker, Clock, Heart } from 'lucide-react';
import { formatTime } from "../utils/formatters";
import { useUser } from "../context/UserProvider";

export default function NowPlayingView() {
  const { 
    currentEpisode, 
    isPlaying, 
    togglePlayPause, 
    playNext, 
    playPrevious, 
    isMaximized, 
    setIsMaximized, 
    duration, 
    currentTime, 
    audioRef, 
    playbackRate, 
    setPlaybackRate 
  } = useAudioPlayerNowPlaying();

  const { favoriteEpisode, unfavoriteEpisode, isFavorite } = useUser();

  if (!currentEpisode) return null;

  const isCurrentlyFavorite = currentEpisode ? isFavorite(currentEpisode.guid) : false;

  const handleFavoriteToggle = () => {
    if (!currentEpisode) return;
    if (isCurrentlyFavorite) {
      unfavoriteEpisode(currentEpisode.guid);
    } else {
      favoriteEpisode(currentEpisode);
    }
  };

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (audioRef.current) {
        audioRef.current.currentTime = Number(e.target.value);
    }
  }

  return (
    <div className={`fixed inset-0 z-[100] bg-[--background] transition-transform duration-500 flex flex-col items-center justify-center p-8 ${isMaximized ? 'translate-y-0' : 'translate-y-full'}`}>
        <button onClick={() => setIsMaximized(false)} className="absolute top-8 left-8 text-[--text-secondary] hover:text-[--text-main]">
            <ChevronDown size={32} />
        </button>

        <div className="w-full max-w-md flex flex-col items-center">
            <img src={currentEpisode.image} alt={currentEpisode.title} className="w-full aspect-square rounded-2xl shadow-2xl shadow-black/40 mb-8" />
            <div className="text-center">
              <h2 className="text-3xl font-bold text-text-main">{currentEpisode.title}</h2>
              <h3 className="text-lg text-text-secondary mt-2">{currentEpisode.podcastTitle}</h3>
            </div>
            
            <div className="flex items-center justify-center gap-8 my-8 w-full">
                <button onClick={handleFavoriteToggle} className="text-primary"><Heart size={28} fill={isCurrentlyFavorite ? 'currentColor' : 'none'} /></button>
                <button onClick={playPrevious} className="text-[--text-secondary] hover:text-[--text-main]"><Rewind size={32} /></button>
                <button onClick={togglePlayPause} className="bg-[--primary] text-white rounded-full w-20 h-20 flex items-center justify-center text-5xl">
                    {isPlaying ? <Pause size={40} /> : <Play size={40} className="ml-1" />}
                </button>
                <button onClick={playNext} className="text-[--text-secondary] hover:text-[--text-main]"><FastForward size={32} /></button>
                <div className="w-[28px]"></div>
            </div>
            
            <div className="w-full mt-4">
                <input
                    type="range"
                    min="0"
                    max={duration || 0}
                    value={currentTime}
                    onChange={handleProgressChange}
                    className="w-full h-1 bg-[--overlay] rounded-lg appearance-none cursor-pointer range-sm"
                />
                <div className="flex justify-between text-xs text-[--text-tertiary] mt-1">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                </div>
            </div>
        </div>
    </div>
  )
}
