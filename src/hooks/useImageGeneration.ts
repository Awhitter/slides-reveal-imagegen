import { useState } from 'react';
import { Slide } from '../contexts/ModuleContext';

/**
 * API configuration
 * TODO: Move these to a separate config file
 */
const API_URL = 'https://api.together.xyz/v1/images/generations';
const TOGETHER_API_KEY = import.meta.env.VITE_TOGETHER_API_KEY;

if (!TOGETHER_API_KEY) {
  console.error('VITE_TOGETHER_API_KEY is not set in the environment variables');
}

/**
 * Custom hook for generating images based on slide prompts
 * @returns {Object} An object containing the generateImage function, loading state, and error state
 */
export const useImageGeneration = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Generates an image based on the slide's image prompt
   * @param {Slide} slide - The slide object containing the image prompt
   * @returns {Promise<string | null>} The URL of the generated image, or null if generation failed
   */
  const generateImage = async (slide: Slide): Promise<string | null> => {
    if (!slide.imagePrompt) {
      setError('Image prompt is required');
      return null;
    }

    if (!TOGETHER_API_KEY) {
      setError('API key is not set');
      return null;
    }

    setIsLoading(true);
    setError(null);

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
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.data && data.data.length > 0 && data.data[0].url) {
        return data.data[0].url;
      } else {
        throw new Error('No image URL in the response');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(`Error generating image: ${errorMessage}`);
      console.error('Error:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { generateImage, isLoading, error, setError };
};
