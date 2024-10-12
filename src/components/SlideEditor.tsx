import React from 'react';
import { Slide } from '../contexts/ModuleContext';
import { Trash2, Image, ChevronUp, ChevronDown } from 'lucide-react';

interface SlideEditorProps {
  slide: Slide;
  onUpdate: (slide: Slide) => void;
  onDelete: () => void;
  onGenerateImage: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  isLoading: boolean;
  slideNumber: number;
  isFirst: boolean;
  isLast: boolean;
}

const SlideEditor: React.FC<SlideEditorProps> = ({
  slide,
  onUpdate,
  onDelete,
  onGenerateImage,
  onMoveUp,
  onMoveDown,
  isLoading,
  slideNumber,
  isFirst,
  isLast
}) => {
  return (
    <div className="border p-4 rounded mb-4 bg-white shadow-sm">
      <div className="flex items-center mb-2">
        <h3 className="font-medium text-lg flex-grow">Slide {slideNumber}</h3>
        <div className="flex space-x-2">
          <button
            onClick={onMoveUp}
            disabled={isFirst}
            className="text-gray-500 hover:text-gray-700 transition duration-300 disabled:opacity-50"
          >
            <ChevronUp size={20} />
          </button>
          <button
            onClick={onMoveDown}
            disabled={isLast}
            className="text-gray-500 hover:text-gray-700 transition duration-300 disabled:opacity-50"
          >
            <ChevronDown size={20} />
          </button>
          <button
            onClick={onDelete}
            className="text-red-500 hover:text-red-700 transition duration-300"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>
      <input
        type="text"
        value={slide.title}
        onChange={(e) => onUpdate({ ...slide, title: e.target.value })}
        placeholder="Slide Title"
        className="mb-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
      />
      <textarea
        value={slide.content}
        onChange={(e) => onUpdate({ ...slide, content: e.target.value })}
        placeholder="Slide Content"
        className="mb-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        rows={3}
      />
      <div className="flex items-center mb-2">
        <input
          type="text"
          value={slide.imagePrompt}
          onChange={(e) => onUpdate({ ...slide, imagePrompt: e.target.value })}
          placeholder="Image Prompt"
          className="flex-grow mr-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
        <button
          type="button"
          onClick={onGenerateImage}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300 flex items-center disabled:opacity-50"
          disabled={isLoading || !slide.imagePrompt}
        >
          <Image className="inline-block mr-2" size={16} />
          Generate
        </button>
      </div>
      {slide.imageUrl && (
        <img src={slide.imageUrl} alt="Generated visual" className="mt-2 max-w-full h-auto rounded" />
      )}
    </div>
  );
};

export default SlideEditor;