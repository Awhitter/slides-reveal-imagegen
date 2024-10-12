import React, { useState } from 'react';
import { Slide } from '../contexts/ModuleContext';

interface AIGeneratorProps {
  onGenerate: (slide: Partial<Slide>) => void;
}

const AIGenerator: React.FC<AIGeneratorProps> = ({ onGenerate }) => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      // Replace this with your actual API call
      const response = await fetch('/api/generate-slide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });
      const data = await response.json();
      onGenerate(data);
    } catch (error) {
      console.error('Error generating slide:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mb-4">
      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter a prompt for AI generation"
        className="w-full p-2 border rounded"
      />
      <button
        onClick={handleGenerate}
        disabled={isLoading || !prompt}
        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {isLoading ? 'Generating...' : 'Generate Slide'}
      </button>
    </div>
  );
};

export default AIGenerator;
