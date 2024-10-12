import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, PlusCircle, User, Home } from 'lucide-react';
import { motion } from 'framer-motion';

const Header: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { name: 'Home', path: '/', icon: <Home size={20} /> },
    { name: 'Create Module', path: '/author', icon: <PlusCircle size={20} /> },
    // Add more nav items as needed
  ];

  return (
    <header className="bg-indigo-600 text-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <BookOpen size={28} />
          <span className="text-2xl font-bold">HLT</span>
        </Link>
        <nav>
          <ul className="flex space-x-6 items-center">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className={`flex items-center space-x-1 transition duration-300 ${
                    location.pathname === item.path
                      ? 'text-white'
                      : 'text-indigo-200 hover:text-white'
                  }`}
                >
                  {item.icon}
                  <span className="font-medium">{item.name}</span>
                </Link>
              </li>
            ))}
            <li>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <button className="bg-indigo-500 p-2 rounded-full hover:bg-indigo-400 transition duration-300">
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

export default React.memo(Header);
