import React, { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, PlusCircle, User, Home } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * Header component for the application
 * Displays the logo and navigation menu
 */
const Header: React.FC = () => {
  const location = useLocation();

  // Memoize navItems to prevent unnecessary re-renders
  const navItems = useMemo(() => [
    { name: 'Home', path: '/', icon: <Home size={20} /> },
    { name: 'Create Module', path: '/author', icon: <PlusCircle size={20} /> },
    // Add more nav items as needed
  ], []);

  return (
    <header className="navbar bg-primary text-primary-content shadow-lg sticky top-0 z-50">
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
                    location.pathname === item.path
                      ? 'active'
                      : ''
                  }`}
                  aria-current={location.pathname === item.path ? 'page' : undefined}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              </li>
            ))}
            <li>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <button className="btn btn-circle btn-ghost" aria-label="User profile">
                  <User size={20} />
                </button>
              </motion.div>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

// Memoize the entire component to prevent unnecessary re-renders
export default React.memo(Header);
