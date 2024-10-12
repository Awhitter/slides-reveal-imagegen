import React from 'react';
import { Link } from 'react-router-dom';
import { Book, Star, Clock } from 'lucide-react';
import { Module } from '../contexts/ModuleContext';

interface ModuleCardProps {
  module: Module;
}

const ModuleCard: React.FC<ModuleCardProps> = ({ module }) => {
  return (
    <Link 
      to={`/module/${module.id}`} 
      className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-300 transform hover:-translate-y-1 flex flex-col"
    >
      <div className="flex items-center mb-4">
        <Book size={24} className="text-blue-500 mr-2" />
        <h2 className="text-xl font-semibold flex-grow">{module.title}</h2>
      </div>
      <p className="text-gray-600 mb-4">{module.slides.length} slides</p>
      <div className="flex items-center justify-between mt-auto">
        <div className="flex items-center">
          <Star size={16} className="text-yellow-400 mr-1" />
          <span className="text-sm">4.5</span>
        </div>
        <div className="flex items-center">
          <Clock size={16} className="text-gray-400 mr-1" />
          <span className="text-sm">10 min</span>
        </div>
      </div>
    </Link>
  );
};

export default ModuleCard;