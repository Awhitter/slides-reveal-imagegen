import React from 'react';
import { Link } from 'react-router-dom';
import { Book, Clock } from 'lucide-react';
import { Module } from '../types';
import { motion } from 'framer-motion';

interface ModuleCardProps {
  module: Module;
}

const ModuleCard: React.FC<ModuleCardProps> = ({ module }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white rounded-lg shadow hover:shadow-lg transition duration-300 overflow-hidden"
    >
      <Link to={`/module/${module.id}`} className="block h-full">
        <div className="p-6">
          <h3 className="text-2xl font-semibold mb-2 text-gray-800">{module.title}</h3>
          <p className="text-gray-600 mb-4">
            An interactive module to enhance your learning experience.
          </p>
          <div className="flex justify-between items-center text-sm text-gray-500">
            <div className="flex items-center">
              <Book size={16} className="mr-1" />
              <span>{module.slides.length} slides</span>
            </div>
            <div className="flex items-center">
              <Clock size={16} className="mr-1" />
              <span>{new Date(module.updatedAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default React.memo(ModuleCard);
