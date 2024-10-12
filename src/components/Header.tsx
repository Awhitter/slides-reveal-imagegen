import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, PlusCircle, User } from 'lucide-react';

const Header: React.FC = () => {
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
              <Link to="/" className="hover:text-indigo-200 transition duration-300">Home</Link>
            </li>
            <li>
              <Link to="/author" className="flex items-center hover:text-indigo-200 transition duration-300">
                <PlusCircle size={20} className="mr-1" />
                Create Module
              </Link>
            </li>
            <li>
              <button className="bg-indigo-500 p-2 rounded-full hover:bg-indigo-400 transition duration-300">
                <User size={20} />
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;