import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useModules } from '../contexts/ModuleContext';
import { Plus, Search } from 'lucide-react';
import ModuleCard from '../components/ModuleCard';
import { motion } from 'framer-motion';

const HomePage: React.FC = () => {
  const { modules } = useModules();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredModules, setFilteredModules] = useState(modules);

  useEffect(() => {
    setFilteredModules(
      modules.filter(module =>
        module.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [modules, searchTerm]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8"
    >
      <section className="text-center mb-12">
        <motion.h1
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
          className="text-4xl font-bold mb-4"
        >
          Welcome to AI-Powered E-Learning
        </motion.h1>
        <p className="text-xl mb-8">Discover a new way of learning with our interactive, AI-driven modules.</p>
        <Link 
          to="/author" 
          className="btn-primary inline-flex items-center"
        >
          <Plus size={24} className="mr-2" />
          Create New Module
        </Link>
      </section>

      <div className="mb-8">
        <div className="relative">
          <input
            type="text"
            placeholder="Search modules..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-primary pr-10"
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        </div>
      </div>

      {filteredModules.length === 0 ? (
        <p className="text-center text-gray-600">No modules found. Try a different search term or create a new module!</p>
      ) : (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ staggerChildren: 0.1 }}
        >
          {filteredModules.map((module) => (
            <ModuleCard key={module.id} module={module} />
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default HomePage;
