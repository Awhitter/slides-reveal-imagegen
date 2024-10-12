import React, { useMemo, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, PlusCircle, Home, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';

const themes = ['light', 'dark', 'cupcake', 'corporate', 'synthwave', 'retro', 'cyberpunk', 'valentine', 'halloween', 'garden', 'forest', 'aqua', 'lofi', 'pastel', 'fantasy', 'wireframe', 'black', 'luxury', 'dracula', 'cmyk', 'autumn', 'business', 'acid', 'lemonade', 'night', 'coffee', 'winter'];

const Header: React.FC = () => {
  const location = useLocation();
  const [theme, setTheme] = useState<string>(
    localStorage.getItem('theme') || 'dark'
  );

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const navItems = useMemo(() => [
    { name: 'Home', path: '/', icon: <Home size={20} /> },
    { name: 'Create Module', path: '/author', icon: <PlusCircle size={20} /> },
  ], []);

  return (
    <header className="navbar bg-base-100 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex-1">
          <Link to="/" className="btn btn-ghost normal-case text-xl">
            <BookOpen size={28} className="mr-2" />
            <span className="font-bold">HLT</span>
          </Link>
        </div>
        <nav className="flex-none">
          <ul className="menu menu-horizontal px-1">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className={`flex items-center space-x-1 ${
                    location.pathname === item.path ? 'text-primary' : ''
                  }`}
                  aria-current={location.pathname === item.path ? 'page' : undefined}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
            <li>
              <div className="dropdown dropdown-end">
                <label tabIndex={0} className="btn btn-ghost btn-circle">
                  <Palette size={20} />
                </label>
                <ul tabIndex={0} className="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52">
                  {themes.map((t) => (
                    <li key={t}>
                      <a
                        className={theme === t ? 'active' : ''}
                        onClick={() => setTheme(t)}
                      >
                        {t.charAt(0).toUpperCase() + t.slice(1)}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default React.memo(Header);
