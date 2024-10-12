import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useModules } from '../contexts/ModuleContext';
import { Plus, Search } from 'lucide-react';
import ModuleCard from '../components/ModuleCard';

const HomePage: React.FC = () => {
  const { modules } = useModules();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredModules = modules.filter(module =>
    module.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Welcome to AI-Powered E-Learning</h1>
        <p className="text-xl mb-8">Discover a new way of learning with our interactive, AI-driven modules.</p>
        <Link 
          to="/author" 
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300 inline-flex items-center"
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
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        </div>
      </div>

      {filteredModules.length === 0 ? (
        <p className="text-center text-gray-600">No modules found. Try a different search term or create a new module!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredModules.map((module) => (
            <ModuleCard key={module.id} module={module} />
          ))}
        </div>
      )}
    </div>
  );
};

export default HomePage;