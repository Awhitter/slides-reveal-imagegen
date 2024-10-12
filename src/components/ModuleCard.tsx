import React from 'react';
import { Link } from 'react-router-dom';
import { Book, Clock } from 'lucide-react';
import { Module } from '../types';
import { motion } from 'framer-motion';

interface ModuleCardProps {
  module: Module;
}

/**
 * ModuleCard component
 * Displays a card with module information and links to the module page
 *
 * @param {ModuleCardProps} props - The props for the ModuleCard component
 * @returns {React.FC} A React functional component
 */
const ModuleCard: React.FC<ModuleCardProps> = ({ module }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300"
    >
      <Link to={`/module/${module.id}`} className="card-body">
        <h3 className="card-title text-2xl">{module.title}</h3>
        <p className="text-base-content opacity-70">
          An interactive module to enhance your learning experience.
        </p>
        <div className="flex justify-between items-center text-sm text-base-content opacity-50 mt-4">
          <div className="flex items-center">
            <Book size={16} className="mr-1" />
            <span>{module.slides.length} slides</span>
          </div>
          <div className="flex items-center">
            <Clock size={16} className="mr-1" />
            <span>{new Date(module.updatedAt).toLocaleDateString()}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default React.memo(ModuleCard);
