import { useState } from 'react';
import { Slide } from '../contexts/ModuleContext';

const API_URL = 'https://api.together.xyz/v1/images/generations';
const TOGETHER_API_KEY = import.meta.env.VITE_TOGETHER_API_KEY;

export const useImageGeneration = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateImage = async (slide: Slide): Promise<string | null> => {
    if (!slide.imagePrompt) {
      setError('Image prompt is required');
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
        throw new Error(errorData.message || 'Failed to generate image');
      }

      const data = await response.json();
      if (data.data && data.data.length > 0 && data.data[0].url) {
        return data.data[0].url;
      } else {
        throw new Error('No image URL in the response');
      }
    } catch (err) {
      setError(
        `Error generating image: ${err instanceof Error ? err.message : 'Unknown error'}`
      );
      console.error('Error:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { generateImage, isLoading, error, setError };
};
