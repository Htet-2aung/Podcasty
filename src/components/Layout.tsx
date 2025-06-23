import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import MiniPlayer from './MiniPlayer';
import Sidebar from './Sidebar';
import Header from './Header';
import { useAudioPlayer } from '../context/AudioProvider';
import NowPlayingView from './NowPlayingView';

const Layout = () => {
  const { currentEpisode } = useAudioPlayer();
  // State to manage the sidebar's visibility on mobile
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  // Close the sidebar automatically when the user navigates to a new page
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  // JS to toggle the class on the sidebar element
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
        {/* Pass the toggle function to the Header */}
        <Header onMenuClick={() => setIsSidebarOpen(true)} />
        
        <main className={`flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 ${currentEpisode ? 'pb-28' : ''}`}>
          <Outlet />
        </main>
        
        {currentEpisode && (
          <>
            <MiniPlayer />
            <NowPlayingView />
          </>
        )}
      </div>

      {/* A semi-transparent overlay to close the sidebar when clicked */}
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
