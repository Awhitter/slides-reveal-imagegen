import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { useModules, Slide, Module } from '../contexts/ModuleContext';
import SlideEditor from '../components/SlideEditor';
import { AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const TOGETHER_API_KEY = import.meta.env.VITE_TOGETHER_API_KEY;
const API_URL = 'https://api.together.xyz/v1/images/generations';

const AuthorPage: React.FC = () => {
  const [step, setStep] = useState(1);
  const [moduleTitle, setModuleTitle] = useState('');
  const [slides, setSlides] = useState<Slide[]>([{ id: uuidv4(), title: '', content: '', imageUrl: '', imagePrompt: '', layout: 'default' }]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { addModule } = useModules();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (moduleTitle.trim() === '') {
      setError('Module title is required');
      return;
    }
    if (slides.some(slide => slide.title.trim() === '' || slide.content.trim() === '')) {
      setError('All slides must have a title and content');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      const newModule: Module = {
        id: uuidv4(),
        title: moduleTitle,
        slides: slides,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      await addModule(newModule);
      navigate('/');
    } catch (err) {
      setError('Error creating module. Please try again.');
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateImage = async (slide: Slide) => {
    if (!slide.imagePrompt) {
      setError('Image prompt is required');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${TOGETHER_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'black-forest-labs/FLUX.1-schnell',
          prompt: slide.imagePrompt,
          n: 1,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to generate image');
      }

      const data = await response.json();
      if (data.data && data.data.length > 0 && data.data[0].url) {
        updateSlide({ ...slide, imageUrl: data.data[0].url });
      } else {
        throw new Error('No image URL in the response');
      }
    } catch (err) {
      setError(`Error generating image: ${err instanceof Error ? err.message : 'Unknown error'}`);
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const addSlide = () => {
    setSlides([...slides, { id: uuidv4(), title: '', content: '', imageUrl: '', imagePrompt: '', layout: 'default' }]);
  };

  const deleteSlide = (id: string) => {
    if (slides.length > 1) {
      setSlides(slides.filter(slide => slide.id !== id));
    } else {
      setError('You must have at least one slide in the module.');
    }
  };

  const updateSlide = (updatedSlide: Slide) => {
    setSlides(slides.map(slide => slide.id === updatedSlide.id ? updatedSlide : slide));
  };

  const moveSlide = (fromIndex: number, toIndex: number) => {
    const updatedSlides = [...slides];
    const [movedSlide] = updatedSlides.splice(fromIndex, 1);
    updatedSlides.splice(toIndex, 0, movedSlide);
    setSlides(updatedSlides);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto px-4 py-8"
    >
      <h1 className="text-3xl font-bold mb-6">Create New Module</h1>
      <div className="mb-8 flex justify-between items-center">
        <div className="flex space-x-2">
          {[1, 2].map((stepNumber) => (
            <div
              key={stepNumber}
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= stepNumber ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}
            >
              {stepNumber}
            </div>
          ))}
        </div>
        <p className="text-gray-600">Step {step} of 2</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        {step === 1 && (
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <label htmlFor="moduleTitle" className="block text-sm font-medium text-gray-700">Module Title</label>
            <input
              type="text"
              id="moduleTitle"
              value={moduleTitle}
              onChange={(e) => setModuleTitle(e.target.value)}
              className="input-primary"
              required
            />
          </motion.div>
        )}
        
        {step === 2 && (
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-xl font-semibold mb-4">Slides</h2>
            {slides.map((slide, index) => (
              <SlideEditor
                key={slide.id}
                slide={slide}
                onUpdate={updateSlide}
                onDelete={() => deleteSlide(slide.id)}
                onGenerateImage={() => handleGenerateImage(slide)}
                onMoveUp={() => moveSlide(index, index - 1)}
                onMoveDown={() => moveSlide(index, index + 1)}
                isLoading={isLoading}
                slideNumber={index + 1}
                isFirst={index === 0}
                isLast={index === slides.length - 1}
              />
            ))}
            <button
              type="button"
              onClick={addSlide}
              className="btn-secondary mt-4"
            >
              Add Slide
            </button>
          </motion.div>
        )}
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
            <AlertCircle className="absolute top-0 right-0 mt-3 mr-3" size={20} />
          </div>
        )}
        
        <div className="flex justify-between mt-8">
          {step > 1 && (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="btn-secondary flex items-center"
            >
              <ChevronLeft size={20} className="mr-1" />
              Previous
            </button>
          )}
          {step < 2 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="btn-primary flex items-center"
            >
              Next
              <ChevronRight size={20} className="ml-1" />
            </button>
          ) : (
            <button
              type="submit"
              className="btn-primary flex items-center justify-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Module...
                </>
              ) : (
                'Create Module'
              )}
            </button>
          )}
        </div>
      </form>
    </motion.div>
  );
};

export default AuthorPage;
