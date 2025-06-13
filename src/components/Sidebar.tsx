import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Search, Library, User, UserCircleIcon } from 'lucide-react';
import ThemeToggle from './ThemeToggle'; // We'll use our new component here
import { useUser } from '../context/UserProvider'; // 1. Import useUser
import { supabase } from '../lib/supabaseClient';
import ArrowRightOnRectangleIcon from '@heroicons/react/24/solid/ArrowRightOnRectangleIcon';

const navItems = [
  { path: '/', label: 'Home', icon: Home },
  { path: '/search', label: 'Search', icon: Search },
  { path: '/library', label: 'Library', icon: Library },
  { path: '/profile', label: 'Profile', icon: User },
];


export default function Sidebar() {

    
const { user } = useUser(); // 2. Get the current user
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/'); // Redirect to home after logout
  };


  const getNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-lg ${
      isActive
        ? 'font-bold text-white bg-primary'
        : 'font-medium text-text-secondary hover:bg-overlay hover:text-text-main'
    }`;


    
  return (
    <aside className="w-64 bg-black/30 p-6 flex-shrink-0 flex flex-col">
      <h1 className="text-2xl font-bold text-primary mb-12">Podcasty</h1>
      <nav className="flex flex-col space-y-2">
        {navItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              `flex items-center space-x-3 p-3 rounded-lg text-lg font-semibold transition-colors ${
                isActive
                  ? 'bg-primary text-white'
                  : 'text-text-secondary hover:bg-surface hover:text-text-main'
              }`
            }
          >
            <item.icon size={24} />
            <span>{item.label}</span>
          </NavLink>
        ))}
<div className="mt-auto">
        <h2 className="px-3 text-sm font-semibold text-text-tertiary uppercase tracking-wider mb-2">
          Preferences
        </h2>
        <ThemeToggle />
      </div>

 {/* 3. Conditionally render Login or User Info/Logout */}
        {user ? (
          <>
            <div className="flex items-center gap-3 px-3 py-2">
              <UserCircleIcon className="w-6 h-6 text-text-secondary" />
              <span className="font-medium text-text-secondary truncate">{user.email}</span>
            </div>
            <button onClick={handleLogout} className={getNavLinkClass({ isActive: false })}>
              <ArrowRightOnRectangleIcon className="w-6 h-6" /> Logout
            </button>
          </>
        ) : (
          <NavLink to="/login" className={getNavLinkClass}>
            <ArrowRightOnRectangleIcon className="w-6 h-6" /> Login
          </NavLink>
        )}


      </nav>
       
    </aside>
  );
}