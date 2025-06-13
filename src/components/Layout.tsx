import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import MiniPlayer from './MiniPlayer';
import NowPlayingView from './NowPlayingView';
import { useAudioPlayer as useAudioPlayerLayout } from '../context/AudioProvider';

export default function Layout() {
  const { currentEpisode } = useAudioPlayerLayout();
  const showPlayer = currentEpisode !== null;

  return (
    <div className="flex h-screen w-screen bg-[--background]">
      <Sidebar />
      <main className={`flex-1 overflow-y-auto ${showPlayer ? 'pb-28' : ''}`}>
        <Outlet />
      </main>
      
      {showPlayer && <MiniPlayer />}
      {showPlayer && <NowPlayingView />}
    </div>
  );
}