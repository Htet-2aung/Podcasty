import { useAudioPlayer as useAudioPlayerMini } from '../context/AudioProvider';
import { Play, Pause, ChevronUp } from 'lucide-react';

export default function MiniPlayer() {
  const { currentEpisode, isPlaying, togglePlayPause, isMaximized, setIsMaximized } = useAudioPlayerMini();

  if (!currentEpisode) return null;

  return (
    // The 'left-64' class for medium screens and up prevents the overlap with the sidebar
    <div
      className={`fixed bottom-0 right-0 z-50 transition-transform duration-500 md:left-64 left-0 ${isMaximized ? 'translate-y-full' : 'translate-y-0'}`}
      onClick={() => setIsMaximized(true)}
    >
      <div className="bg-[--overlay]/50 p-3 m-2 rounded-xl shadow-2xl shadow-black/50 ring-1 ring-white/10 backdrop-blur-lg cursor-pointer">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <img src={currentEpisode.image} alt={currentEpisode.title} className="w-12 h-12 rounded-md object-cover" />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold truncate text-[--text-main]">{currentEpisode.title}</h3>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={(e) => { e.stopPropagation(); togglePlayPause(); }}
              className="text-[--primary] p-2"
            >
              {isPlaying ? <Pause size={28} /> : <Play size={28} />}
            </button>
            <ChevronUp size={24} className="text-[--text-secondary]" />
          </div>
        </div>
      </div>
    </div>
  );
}
