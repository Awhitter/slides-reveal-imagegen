import React from 'react';
import { Slide, SlideLayout } from '../contexts/ModuleContext';
import { Trash2, Image, ChevronUp, ChevronDown, Layout } from 'lucide-react';
import RichTextEditor from './RichTextEditor';

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
  const handleLayoutChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onUpdate({ ...slide, layout: e.target.value as SlideLayout });
  };

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
      <div className="flex items-center mb-2">
        <Layout size={20} className="mr-2" />
        <select
          value={slide.layout}
          onChange={handleLayoutChange}
          className="flex-grow rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        >
          <option value="default">Default</option>
          <option value="image-left">Image Left</option>
          <option value="image-right">Image Right</option>
          <option value="image-background">Image Background</option>
        </select>
      </div>
      <input
        type="text"
        value={slide.title}
        onChange={(e) => onUpdate({ ...slide, title: e.target.value })}
        placeholder="Slide Title"
        className="mb-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
      />
      <RichTextEditor
        value={slide.content}
        onChange={(content) => onUpdate({ ...slide, content })}
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
