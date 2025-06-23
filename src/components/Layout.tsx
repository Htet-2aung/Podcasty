// src/components/Layout.tsx

import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import MiniPlayer from './MiniPlayer';
import Sidebar from './Sidebar';
import Header from './Header';
import { useAudioPlayer } from '../context/AudioProvider';
import NowPlayingView from './NowPlayingView';

const Layout = () => {
  const { currentEpisode } = useAudioPlayer();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
      if (isSidebarOpen) {
        sidebar.classList.remove('-translate-x-full');
      } else {
        sidebar.classList.add('-translate-x-full');
      }
    }
  }, [isSidebarOpen]);

  return (
    <div className="w-full h-screen flex bg-background textured-bg">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuClick={() => setIsSidebarOpen(true)} />
        
        <main className={`flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 ${currentEpisode ? 'pb-24' : ''}`}>
          <Outlet />
        </main>
        
        {currentEpisode && (
          <>
            <MiniPlayer />
            <NowPlayingView />
          </>
        )}
      </div>

      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          aria-hidden="true"
        />
      )}
    </div>
  );
};

export default Layout;
