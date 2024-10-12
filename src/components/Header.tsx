import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, PlusCircle, User } from 'lucide-react';
import { motion } from 'framer-motion';

const Header: React.FC = () => {
  const location = useLocation();

  return (
    <header className="bg-indigo-600 text-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <BookOpen size={24} />
          <span className="text-xl font-bold">AI E-Learning</span>
        </Link>
        <nav>
          <ul className="flex space-x-4 items-center">
            <li>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Link
                  to="/author"
                  className={`bg-indigo-500 p-2 rounded-full hover:bg-indigo-400 transition duration-300 ${
                    location.pathname === '/author' ? 'ring-2 ring-white' : ''
                  }`}
                >
                  <PlusCircle size={20} />
                </Link>
              </motion.div>
            </li>
            <li>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
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
