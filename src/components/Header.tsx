import { Menu } from 'lucide-react';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  return (
    // This header is sticky and has a blurred background for a modern feel.
    // Importantly, it's hidden on medium screens and larger (`md:hidden`)
    <header className="md:hidden bg-surface/80 backdrop-blur-lg sticky top-0 z-10 border-b border-overlay p-4 flex items-center">
      <button onClick={onMenuClick} className="p-2 rounded-md text-text-main">
        <Menu size={24} />
      </button>
      <h1 className="text-xl font-bold text-primary ml-4">Podcasty</h1>
    </header>
  );
};

export default Header;
