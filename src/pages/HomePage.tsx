import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Wand2, RefreshCw } from 'lucide-react'
import { motion } from 'framer-motion'
import { useModules } from '../contexts/ModuleContext'
import { useImageGeneration } from '../hooks/useImageGeneration'
import ModuleCard from '../components/ModuleCard'
import AIAssistant from '../components/AIAssistant'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'

export default function HomePage() {
  const { modules, loading, error } = useModules()
  const [backgroundImage, setBackgroundImage] = useState<string | null>(null)
  const [showAIAssistant, setShowAIAssistant] = useState(false)
  const [aiPrompt, setAiPrompt] = useState('')
  const { toast } = useToast()
  const { generateImage, isLoading, error: imageError } = useImageGeneration()

  useEffect(() => {
    handleGenerateBackground()
  }, [])

  const handleGenerateBackground = async () => {
    const newImage = await generateImage({
      imagePrompt: "A futuristic classroom with holographic displays and AI tutors",
    } as any)
    if (newImage) {
      setBackgroundImage(newImage)
    } else if (imageError) {
      toast({
        title: "Error",
        description: "Failed to generate background image. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleAIAssist = async () => {
    if (!aiPrompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a prompt for the AI assistant.",
        variant: "destructive",
      })
      return
    }
    setShowAIAssistant(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-base-200 to-base-300">
      <section className="relative w-full h-screen overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-500"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-60" />
        </div>
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
          <motion.h1
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 50 }}
            className="text-5xl sm:text-6xl md:text-7xl font-extrabold mb-6 text-white"
          >
            AI-Powered E-Learning
          </motion.h1>
          <motion.p
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 50, delay: 0.2 }}
            className="text-xl sm:text-2xl mb-8 max-w-2xl text-gray-200"
          >
            Discover a new way of learning with our interactive, AI-driven modules.
          </motion.p>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 50, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link to="/author">
              <Button variant="default" size="lg">
                <Plus className="mr-2 h-5 w-5" />
                Create New Module
              </Button>
            </Link>
            <Button 
              variant="secondary" 
              size="lg" 
              onClick={handleGenerateBackground}
              disabled={isLoading}
            >
              {isLoading ? (
                <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
              ) : (
                <Wand2 className="mr-2 h-5 w-5" />
              )}
              {isLoading ? 'Generating...' : 'New Background'}
            </Button>
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-base-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">AI Assistant</h2>
          <div className="flex justify-center mb-8">
            <div className="flex w-full max-w-sm items-center space-x-2">
              <Input
                type="text"
                placeholder="Ask AI to create something..."
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
              />
              <Button onClick={handleAIAssist}>Ask AI</Button>
            </div>
          </div>
          {showAIAssistant && <AIAssistant prompt={aiPrompt} />}
        </div>
      </section>

      <section className="py-16 bg-base-200">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Featured Modules</h2>
          {loading ? (
            <div className="flex justify-center">
              <span className="loading loading-spinner loading-lg"></span>
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
