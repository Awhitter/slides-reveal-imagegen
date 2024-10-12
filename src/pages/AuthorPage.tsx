import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { useModules, Slide, Module } from '../contexts/ModuleContext';
import SlideEditor from '../components/SlideEditor';
import { ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { useImageGeneration } from '../hooks/useImageGeneration';
import LoadingSpinner from '../components/LoadingSpinner';
import ModulePreview from '../components/ModulePreview';

/**
 * AuthorPage component for creating and editing modules
 */
const AuthorPage: React.FC = () => {
  const [step, setStep] = useState(1);
  const [moduleTitle, setModuleTitle] = useState('');
  const [slides, setSlides] = useState<Slide[]>([
    {
      id: uuidv4(),
      title: '',
      content: '',
      imageUrl: '',
      imagePrompt: '',
      layout: 'default',
    },
  ]);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const navigate = useNavigate();
  const { addModule } = useModules();
  const { generateImage, isLoading, error, setError } = useImageGeneration();

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (moduleTitle.trim() === '') {
      setError('Module title is required');
      return;
    }
    if (slides.some((slide) => slide.title.trim() === '' || slide.content.trim() === '')) {
      setError('All slides must have a title and content');
      return;
    }
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
    }
  }, [moduleTitle, slides, addModule, navigate, setError]);

  const handleGenerateImage = useCallback(async (slide: Slide) => {
    const imageUrl = await generateImage(slide);
    if (imageUrl) {
      updateSlide({ ...slide, imageUrl });
    }
  }, [generateImage]);

  const addSlide = useCallback(() => {
    setSlides(prevSlides => [
      ...prevSlides,
      {
        id: uuidv4(),
        title: '',
        content: '',
        imageUrl: '',
        imagePrompt: '',
        layout: 'default',
      },
    ]);
  }, []);

  const deleteSlide = useCallback((id: string) => {
    setSlides(prevSlides => {
      if (prevSlides.length > 1) {
        return prevSlides.filter((slide) => slide.id !== id);
      } else {
        setError('You must have at least one slide in the module.');
        return prevSlides;
      }
    });
  }, [setError]);

  const updateSlide = useCallback((updatedSlide: Slide) => {
    setSlides(prevSlides => prevSlides.map((slide) => (slide.id === updatedSlide.id ? updatedSlide : slide)));
  }, []);

  const moveSlide = useCallback((fromIndex: number, toIndex: number) => {
    setSlides(prevSlides => {
      const updatedSlides = [...prevSlides];
      const [movedSlide] = updatedSlides.splice(fromIndex, 1);
      updatedSlides.splice(toIndex, 0, movedSlide);
      return updatedSlides;
    });
  }, []);

  const handleGenerateSlides = async () => {
    if (!aiPrompt) {
      setAiError('Please enter a prompt.');
      return;
    }

    setIsAiLoading(true);
    setAiError(null);

    try {
      const response = await fetch('/api/generate-slides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: aiPrompt }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate slides.');
      }

      const data = await response.json();
      setSlides(data.slides);
    } catch (err: any) {
      console.error('AI Generation Error:', err);
      setAiError(err.message);
    } finally {
      setIsAiLoading(false);
    }
  };

  const stepIndicators = useMemo(() => (
    <div className="flex space-x-2">
      {[1, 2, 3].map((stepNumber) => (
        <div
          key={stepNumber}
          className={`w-8 h-8 rounded-full flex items-center justify-center ${
            step >= stepNumber ? 'bg-primary text-primary-content' : 'bg-base-200 text-base-content'
          }`}
        >
          {stepNumber}
        </div>
      ))}
    </div>
  ), [step]);

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <label htmlFor="moduleTitle" className="block text-sm font-medium text-base-content">
              Module Title
            </label>
            <input
              type="text"
              id="moduleTitle"
              value={moduleTitle}
              onChange={(e) => setModuleTitle(e.target.value)}
              className="input input-bordered w-full"
              required
            />
          </motion.div>
        );
      case 2:
        return (
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
            <button type="button" onClick={addSlide} className="btn btn-secondary mt-4">
              Add Slide
            </button>

            <div className="mt-8 p-4 bg-base-200 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">AI Assistant</h3>
              <textarea
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="Enter a prompt for AI-generated slides..."
                className="textarea textarea-bordered w-full mb-2"
                rows={3}
              />
              <button
                type="button"
                onClick={handleGenerateSlides}
                disabled={isAiLoading}
                className="btn btn-primary"
              >
                {isAiLoading ? <LoadingSpinner size="sm" /> : 'Generate Slides'}
              </button>
              {aiError && <p className="text-error mt-2">{aiError}</p>}
            </div>
          </motion.div>
        );
      case 3:
        return (
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-xl font-semibold mb-4">Preview</h2>
            <ModulePreview module={{ id: 'preview', title: moduleTitle, slides, createdAt: new Date(), updatedAt: new Date() }} />
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto px-4 py-8"
    >
      <h1 className="text-3xl font-bold mb-6 text-center">Create a Stunning Module</h1>
      <div className="mb-8 flex justify-between items-center">
        {stepIndicators}
        <p className="text-base-content">Step {step} of 3</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        {renderStepContent()}

        {error && (
          <div className="alert alert-error" role="alert">
            <strong className="font-bold">Error: </strong>
            <span>{error}</span>
          </div>
        )}

        <div className="flex justify-between mt-8">
          {step > 1 && (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="btn btn-outline"
            >
              <ChevronLeft size={20} className="mr-1" />
              Previous
            </button>
          )}
          {step < 3 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="btn btn-primary"
            >
              Next
              <ChevronRight size={20} className="ml-1" />
            </button>
          ) : (
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <LoadingSpinner size="sm" />
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
