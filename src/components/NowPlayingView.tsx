import { useAudioPlayer as useAudioPlayerNowPlaying } from "../context/AudioProvider";
import { ChevronDown, Play, Pause, Rewind, FastForward, Speaker, Clock } from 'lucide-react';
import { formatTime } from "../utils/formatters";

export default function NowPlayingView() {
  const { currentEpisode, isPlaying, togglePlayPause, isMaximized, setIsMaximized, duration, currentTime, audioRef, playbackRate, setPlaybackRate } = useAudioPlayerNowPlaying();

  if (!currentEpisode) return null;

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    audioRef.current!.currentTime = Number(e.target.value);
  }

  return (
    <div className={`fixed inset-0 z-[100] bg-[--background] transition-transform duration-500 flex flex-col items-center justify-center p-8 ${isMaximized ? 'translate-y-0' : 'translate-y-full'}`}>
        <button onClick={() => setIsMaximized(false)} className="absolute top-8 left-8 text-[--text-secondary] hover:text-[--text-main]">
            <ChevronDown size={32} />
        </button>

        <div className="w-full max-w-md flex flex-col items-center">
            <img src={currentEpisode.image} alt={currentEpisode.title} className="w-full aspect-square rounded-2xl shadow-2xl shadow-black/40 mb-8" />
            <h2 className="text-3xl font-bold text-center text-[--text-main]">{currentEpisode.title}</h2>
            <h3 className="text-lg text-[--text-secondary] mt-2">{currentEpisode.podcastTitle}</h3>

            <div className="w-full mt-8">
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

            <div className="flex items-center justify-center gap-8 my-8">
                <button className="text-[--text-secondary] hover:text-[--text-main]"><Rewind size={32} /></button>
                <button onClick={togglePlayPause} className="bg-[--primary] text-white rounded-full w-20 h-20 flex items-center justify-center text-5xl">
                    {isPlaying ? <Pause size={40} /> : <Play size={40} className="ml-1" />}
                </button>
                <button className="text-[--text-secondary] hover:text-[--text-main]"><FastForward size={32} /></button>
            </div>
            
            <div className="w-full flex justify-between items-center text-[--text-secondary]">
                <div className="flex gap-2 items-center">
                    <Clock size={20} />
                    <span>Timer</span>
                </div>
                 <div className="flex gap-2 items-center">
                    <span className="font-bold">{playbackRate}x</span>
                    <button onClick={() => setPlaybackRate(playbackRate >= 2 ? 1 : playbackRate + 0.25)}>Speed</button>
                 </div>
            </div>
        </div>
    </div>
  )
}