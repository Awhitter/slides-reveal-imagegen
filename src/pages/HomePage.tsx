import React from 'react'
import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { motion } from 'framer-motion'
import ModuleCard from '../components/ModuleCard'
import LoadingSpinner from '../components/LoadingSpinner'
import { useModules } from '../contexts/ModuleContext'

export default function HomePage() {
  const { modules, loading, error } = useModules();

  return (
    <div className="min-h-screen">
      <section className="relative w-full h-screen overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80)`,
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-60" />
        </div>
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
          <motion.h1
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 50 }}
            className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6 text-white"
          >
            AI-Powered E-Learning
          </motion.h1>
          <motion.p
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 50, delay: 0.2 }}
            className="text-lg sm:text-xl mb-12 max-w-2xl text-gray-200"
          >
            Discover a new way of learning with our interactive, AI-driven modules.
          </motion.p>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 50, delay: 0.4 }}
          >
            <Link 
              to="/author" 
              className="inline-flex items-center px-6 py-3 text-lg font-semibold rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <Plus className="mr-2 h-5 w-5" />
              Create New Module
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-base-200">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Featured Modules</h2>
          {loading ? (
            <div className="flex justify-center">
              <LoadingSpinner />
            </div>
          ) : error ? (
            <p className="text-center text-error">{error}</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {modules.map((module) => (
                <ModuleCard key={module.id} module={module} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
