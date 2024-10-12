import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Reveal from 'reveal.js';
import { useModules } from '../contexts/ModuleContext';
import 'reveal.js/dist/reveal.css';
import 'reveal.js/dist/theme/black.css';
import { ArrowLeft, ArrowRight, Grid, Maximize, Minimize } from 'lucide-react';

const ModulePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getModule } = useModules();
  const module = getModule(id || '');
  const deckRef = useRef<HTMLDivElement>(null);
  const revealRef = useRef<Reveal.Api | null>(null);
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'f') {
      toggleFullscreen();
    }
  };

  useEffect(() => {
    if (module && deckRef.current && !revealRef.current) {
      const initializeReveal = async () => {
        try {
          revealRef.current = new Reveal(deckRef.current, {
            hash: true,
            embedded: false,
            transition: 'slide',
            progress: true,
            controls: false, // Disable built-in controls
            controlsTutorial: false,
            keyboard: true,
            center: false,
            touch: true,
            loop: false,
            rtl: false,
            shuffle: false,
            fragments: true,
            showNotes: false,
            autoSlide: 0,
            autoSlideStoppable: true,
            mouseWheel: false,
            hideAddressBar: true,
            previewLinks: false,
            viewDistance: 3,
            mobileViewDistance: 2,
            width: '100%',
            height: '100%',
            margin: 0,
            minScale: 0.2,
            maxScale: 2.0,
          });

          await revealRef.current.initialize();
          revealRef.current.on('slidechanged', (event: any) => {
            setCurrentSlide(event.indexh);
          });

          // Enable keyboard navigation
          document.addEventListener('keydown', handleKeyDown);
        } catch (error) {
          console.error('Error initializing Reveal.js:', error);
        }
      };

      initializeReveal();
    }

    return () => {
      if (revealRef.current) {
        try {
          revealRef.current.destroy();
        } catch (error) {
          console.error('Error destroying Reveal.js:', error);
        }
        revealRef.current = null;
      }
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [module]);

  if (!module) {
    return (
      <div className="text-center p-8">
        <p className="text-red-500 mb-4">Module not found</p>
        <button
          onClick={() => navigate('/')}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
        >
          <ArrowLeft className="inline-block mr-2" size={20} />
          Back to Home
        </button>
      </div>
    );
  }

  const handlePrevSlide = () => {
    if (revealRef.current) {
      revealRef.current.prev();
    }
  };

  const handleNextSlide = () => {
    if (revealRef.current) {
      revealRef.current.next();
    }
  };

  const handleOverview = () => {
    if (revealRef.current) {
      revealRef.current.toggleOverview();
    }
  };

  return (
    <div className="relative h-screen flex flex-col">
      <div className="bg-gray-800 text-white p-4 flex justify-between items-center">
        <button
          onClick={() => navigate('/')}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
        >
          <ArrowLeft className="inline-block mr-2" size={20} />
          Back to Home
        </button>
        <h1 className="text-2xl font-bold">{module.title}</h1>
        <button
          onClick={toggleFullscreen}
          className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600 transition duration-300"
        >
          {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
        </button>
      </div>
      <div className="flex-grow overflow-hidden">
        <div className="reveal h-full" ref={deckRef}>
          <div className="slides">
            {module.slides.map((slide, index) => (
              <section key={slide.id} className={`flex ${slide.layout === 'image-background' ? 'items-center justify-center' : 'flex-col'}`}>
                {slide.layout === 'image-background' && slide.imageUrl && (
                  <div 
                    className="absolute inset-0 bg-cover bg-center z-0" 
                    style={{backgroundImage: `url(${slide.imageUrl})`}}
                  />
                )}
                <div className={`z-10 ${slide.layout === 'image-background' ? 'bg-black bg-opacity-50 p-8 rounded' : ''}`}>
                  <h2 className="text-3xl font-bold mb-4">{slide.title}</h2>
                  <div className={`flex ${slide.layout === 'image-left' ? 'flex-row-reverse' : 'flex-row'}`}>
                    {(slide.layout === 'image-left' || slide.layout === 'image-right') && slide.imageUrl && (
                      <img 
                        src={slide.imageUrl} 
                        alt={`Slide ${index + 1} visual`} 
                        className="max-w-[40%] max-h-[50vh] object-contain"
                      />
                    )}
                    <div className={`prose max-w-none ${slide.layout !== 'default' ? 'flex-1' : ''}`} dangerouslySetInnerHTML={{ __html: slide.content }} />
                  </div>
                </div>
                {slide.layout === 'default' && slide.imageUrl && (
                  <img 
                    src={slide.imageUrl} 
                    alt={`Slide ${index + 1} visual`} 
                    className="max-w-full max-h-[50vh] object-contain mt-4"
                  />
                )}
              </section>
            ))}
          </div>
        </div>
      </div>
      <div className="bg-gray-800 p-4 flex justify-center items-center space-x-4">
        <button
          onClick={handlePrevSlide}
          className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={currentSlide === 0}
        >
          <ArrowLeft size={20} />
        </button>
        <button
          onClick={handleOverview}
          className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600 transition duration-300"
        >
          <Grid size={20} />
        </button>
        <button
          onClick={handleNextSlide}
          className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-600 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={currentSlide === module.slides.length - 1}
        >
          <ArrowRight size={20} />
        </button>
        <span className="text-white px-3 py-1 rounded ml-4">
          {currentSlide + 1} / {module.slides.length}
        </span>
      </div>
    </div>
  );
};

export default ModulePage;
