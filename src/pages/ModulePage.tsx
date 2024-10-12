import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useModules, Slide as SlideType, Module } from '../contexts/ModuleContext';
import 'reveal.js/dist/reveal.css';
import 'reveal.js/dist/theme/black.css';
import { ArrowLeft, ArrowRight, Maximize, Minimize } from 'lucide-react';
import type { RevealStatic } from 'reveal.js';

const Slide: React.FC<{ slide: SlideType; index: number }> = ({ slide, index }) => (
  <section 
    className={`flex flex-col items-center justify-center h-full ${
      slide.layout === 'image-background' ? 'relative' : ''
    }`}
    data-background-image={slide.layout === 'image-background' ? slide.imageUrl : undefined}
    data-background-size="cover"
    data-background-position="center"
  >
    {slide.layout === 'image-background' && (
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
    )}
    <div className={`z-10 max-w-4xl w-full p-8 ${slide.layout === 'image-background' ? 'text-white' : ''}`}>
      <h2 className="text-4xl font-bold mb-6">{slide.title}</h2>
      <div className={`flex ${slide.layout === 'image-left' ? 'flex-row-reverse' : 'flex-row'} gap-8`}>
        {(slide.layout === 'image-left' || slide.layout === 'image-right') && slide.imageUrl && (
          <img 
            src={slide.imageUrl} 
            alt={`Slide ${index + 1} visual`} 
            className="w-1/2 h-auto object-contain"
          />
        )}
        <div 
          className={`prose max-w-none ${slide.layout !== 'default' ? 'flex-1' : ''} ${
            slide.layout === 'image-background' ? 'text-white' : ''
          }`} 
          dangerouslySetInnerHTML={{ __html: slide.content }} 
        />
      </div>
    </div>
    {slide.layout === 'default' && slide.imageUrl && (
      <img 
        src={slide.imageUrl} 
        alt={`Slide ${index + 1} visual`} 
        className="max-w-full max-h-[50vh] object-contain mt-8"
      />
    )}
  </section>
);

const ModulePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getModule } = useModules();
  const [module, setModule] = useState<Module | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const deckRef = useRef<HTMLDivElement>(null);
  const revealRef = useRef<RevealStatic | null>(null);

  useEffect(() => {
    const fetchedModule = getModule(id);
    if (fetchedModule) {
      setModule(fetchedModule);
    }
  }, [id, getModule]);

  useEffect(() => {
    if (module && deckRef.current && !revealRef.current) {
      import('reveal.js').then((RevealModule) => {
        const Reveal = RevealModule.default;
        revealRef.current = new Reveal(deckRef.current, {
          hash: true,
          embedded: false,
          transition: 'slide',
          progress: true,
          controls: false,
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
          width: '100%',
          height: '100%',
        });

        revealRef.current.initialize().then(() => {
          revealRef.current?.on('slidechanged', (event: any) => {
            setCurrentSlide(event.indexh);
          });
        });
      });
    }

    return () => {
      if (revealRef.current) {
        revealRef.current.destroy();
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
      <div className="flex-1 overflow-hidden">
        <div className="reveal h-full" ref={deckRef}>
          <div className="slides">
            {module.slides.map((slide, index) => (
              <Slide key={slide.id} slide={slide} index={index} />
            ))}
          </div>
        </div>
      </div>
      <div className="bg-gray-800 text-white p-4 flex justify-between items-center">
        <button
          onClick={() => revealRef.current?.prev()}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
          disabled={currentSlide === 0}
        >
          <ArrowLeft className="inline-block mr-2" size={20} />
          Previous
        </button>
        <span>{`Slide ${currentSlide + 1} of ${module.slides.length}`}</span>
        <button
          onClick={() => revealRef.current?.next()}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
          disabled={currentSlide === module.slides.length - 1}
        >
          Next
          <ArrowRight className="inline-block ml-2" size={20} />
        </button>
      </div>
    </div>
  );
};
    if (node && module && !revealRef.current) {
      revealRef.current = new Reveal(node, revealConfig);
      revealRef.current.initialize().then(() => {
        revealRef.current?.on('slidechanged', (event: any) => {
          setCurrentSlide(event.indexh);
        });
      });
    }
  }, [module]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (revealRef.current && typeof revealRef.current.destroy === 'function') {
        try {
          revealRef.current.destroy();
        } catch (error) {
          console.error('Error destroying Reveal instance:', error);
        }
        revealRef.current = null;
      }
    };
  }, []);

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
              <Slide key={slide.id} slide={slide} index={index} />
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
