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
            controls: false,
            keyboard: true,
            center: true,
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
    <div className="relative h-screen">
      <div className="reveal w-full h-full" ref={deckRef}>
        <div className="slides">
          {module.slides.map((slide, index) => (
            <section key={slide.id}>
              <h2>{slide.title}</h2>
              <div dangerouslySetInnerHTML={{ __html: slide.content }} />
              {slide.imageUrl && <img src={slide.imageUrl} alt={`Slide ${index + 1} visual`} className="w-1/2 mx-auto" />}
            </section>
          ))}
        </div>
      </div>
      <div className="absolute top-4 left-4 z-10 flex space-x-2">
        <button
          onClick={() => navigate('/')}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
        >
          <ArrowLeft className="inline-block mr-2" size={20} />
          Back to Home
        </button>
        <button
          onClick={toggleFullscreen}
          className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700 transition duration-300"
        >
          {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
        </button>
      </div>
      <div className="absolute bottom-4 left-0 right-0 flex justify-center items-center space-x-4 z-10">
        <button
          onClick={handlePrevSlide}
          className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={currentSlide === 0}
        >
          <ArrowLeft size={20} />
        </button>
        <button
          onClick={handleOverview}
          className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700 transition duration-300"
        >
          <Grid size={20} />
        </button>
        <button
          onClick={handleNextSlide}
          className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={currentSlide === module.slides.length - 1}
        >
          <ArrowRight size={20} />
        </button>
        <span className="text-white bg-gray-800 px-3 py-1 rounded ml-4">
          {currentSlide + 1} / {module.slides.length}
        </span>
      </div>
    </div>
  );
};

export default ModulePage;
