// src/components/Sidebar.tsx

import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Search, Library, User, LogIn, LogOut, Settings } from 'lucide-react';
import { useUser } from '../context/UserProvider';
import { supabase } from '../lib/supabaseClient';

const navItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/search', label: 'Search', icon: Search },
  { path: '/library', label: 'Library', icon: Library },
];

export default function Sidebar() {
  const { user } = useUser();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    // --- FIX: Navigate to a public page after logout ---
    navigate('/welcome');
  };

  const getNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-4 px-4 py-2.5 rounded-lg transition-colors text-base font-semibold ${
      isActive
        ? 'text-white bg-primary'
        : 'text-text-secondary hover:bg-overlay hover:text-text-main'
    }`;

  return (
    <aside
      id="sidebar"
      className="fixed inset-y-0 left-0 w-64 transform -translate-x-full transition-transform duration-300 ease-in-out md:relative md:translate-x-0 z-50 flex-shrink-0"
    >
      <div className="h-full w-full bg-surface/80 md:bg-surface/50 backdrop-blur-xl border-r border-overlay p-4 flex flex-col">
        <h1 className="text-2xl font-extrabold text-primary px-4 mb-10">Podcasty</h1>
        <nav className="flex flex-col gap-2 flex-grow">
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={getNavLinkClass}
            >
              <item.icon strokeWidth={2.5} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="flex flex-col gap-2">
          {user ? (
            <>
              <NavLink to="/profile" className={getNavLinkClass}>
                <User strokeWidth={2.5} /> Profile
              </NavLink>
               <NavLink to="/settings" className={getNavLinkClass}>
                <Settings strokeWidth={2.5} /> Settings
              </NavLink>
              <button onClick={handleLogout} className={`${getNavLinkClass({ isActive: false })} w-full`}>
                <LogOut strokeWidth={2.5} /> Logout
              </button>
            </>
          ) : (
            <NavLink to="/login" className={getNavLinkClass}>
              <LogIn strokeWidth={2.5} /> Login
            </NavLink>
          )}
        </div>
      </div>
    </aside>
  );
}
