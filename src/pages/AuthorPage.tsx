import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { useModules, Slide, Module } from '../contexts/ModuleContext';
import SlideEditor from '../components/SlideEditor';
import { ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { useImageGeneration } from '../hooks/useImageGeneration';
import LoadingSpinner from '../components/LoadingSpinner';
import ModulePreview from '../components/ModulePreview';

const AuthorPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const [step, setStep] = useState(1);
  const [moduleTitle, setModuleTitle] = useState('');
  const [slides, setSlides] = useState<Slide[]>([]);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const navigate = useNavigate();
  const { addModule, getModule, updateModule } = useModules();
  const { generateImage, isLoading, error, setError } = useImageGeneration();

  useEffect(() => {
    if (id) {
      const existingModule = getModule(id);
      if (existingModule) {
        setModuleTitle(existingModule.title);
        setSlides(existingModule.slides);
      } else {
        setError('Module not found');
        navigate('/');
      }
    } else {
      setSlides([
        {
          id: uuidv4(),
          title: '',
          content: '',
          imageUrl: '',
          imagePrompt: '',
          layout: 'default',
        },
      ]);
    }
  }, [id, getModule, setError, navigate]);

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
      const moduleData: Module = {
        id: id || uuidv4(),
        title: moduleTitle,
        slides: slides,
        createdAt: id ? (getModule(id)?.createdAt || new Date()) : new Date(),
        updatedAt: new Date(),
      };
      if (id) {
        await updateModule(moduleData);
      } else {
        await addModule(moduleData);
      }
      navigate('/');
    } catch (err) {
      setError('Error saving module. Please try again.');
      console.error('Error:', err);
    }
  }, [moduleTitle, slides, addModule, updateModule, navigate, setError, id, getModule]);

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
      <h1 className="text-3xl font-bold mb-6 text-center">{id ? 'Edit Module' : 'Create a New Module'}</h1>
      <div className="mb-8 flex justify-between items-center">
        <div className="flex space-x-2">
          {[1, 2, 3].map((stepNumber) => (
            <div
              key={stepNumber}
              className={`w-3 h-3 rounded-full ${
                step >= stepNumber ? 'bg-primary' : 'bg-base-300'
              }`}
            />
          ))}
        </div>
        <p className="text-sm text-base-content opacity-70">Step {step} of 3</p>
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
              className="btn btn-outline btn-sm"
            >
              <ChevronLeft size={16} className="mr-1" />
              Previous
            </button>
          )}
          {step < 3 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="btn btn-primary btn-sm"
            >
              Next
              <ChevronRight size={16} className="ml-1" />
            </button>
          ) : (
            <button
              type="submit"
              className="btn btn-primary btn-sm"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <LoadingSpinner size="xs" />
                  Saving...
                </>
              ) : (
                'Save Module'
              )}
            </button>
          )}
        </div>
      </form>
    </motion.div>
  );
};

export default AuthorPage;
