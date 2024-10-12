import React from 'react';
import { Slide, MediaItem } from '../types';

interface RevealSlideProps {
  slide: Slide;
  index: number;
}

/**
 * RevealSlide component
 * Renders a single slide for the Reveal.js presentation
 *
 * @param {RevealSlideProps} props - The props for the RevealSlide component
 * @returns {React.FC} A React functional component
 */
const RevealSlide: React.FC<RevealSlideProps> = ({ slide, index }) => {
  /**
   * Renders media items based on the slide's layout
   * @param {MediaItem[] | undefined} media - The media items to render
   * @returns {React.ReactNode} The rendered media items
   */
  const renderMedia = (media: MediaItem[] | undefined) => {
    if (!media || media.length === 0) return null;

    return media.map(mediaItem => (
      <img 
        key={mediaItem.id} 
        src={mediaItem.source} 
        alt={mediaItem.alt || `Slide ${index + 1} visual`} 
        className="max-w-full h-auto object-contain"
      />
    ));
  };

  /**
   * Determines the layout class based on the slide's layout property
   * @returns {string} The CSS class for the slide layout
   */
  const getLayoutClass = () => {
    switch (slide.layout) {
      case 'image-left':
        return 'flex flex-col md:flex-row-reverse';
      case 'image-right':
        return 'flex flex-col md:flex-row';
      case 'image-background':
        return 'relative';
      default:
        return 'flex flex-col';
    }
  };

  return (
    <section className={`h-full ${getLayoutClass()}`}>
      {slide.layout === 'image-background' && slide.imageUrl && (
        <div 
          className="absolute inset-0 bg-cover bg-center z-0" 
          style={{ backgroundImage: `url(${slide.imageUrl})` }}
        />
      )}
      <div className={`z-10 p-8 ${slide.layout === 'image-background' ? 'text-white bg-black bg-opacity-50' : ''}`}>
        <h2 className="text-3xl font-bold mb-4">{slide.title}</h2>
        <div 
          className="prose max-w-none" 
          dangerouslySetInnerHTML={{ __html: slide.content }} 
        />
      </div>
      {slide.layout !== 'image-background' && (
        <div className={`flex-1 ${slide.layout === 'image-left' || slide.layout === 'image-right' ? 'md:w-1/2' : ''}`}>
          {renderMedia(slide.media)}
        </div>
      )}
    </section>
  );
};

export default RevealSlide;
