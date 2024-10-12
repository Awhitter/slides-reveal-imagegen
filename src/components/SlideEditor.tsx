import React, { useState } from 'react';
import { Slide, SlideLayout } from '../contexts/ModuleContext';
import { Trash2, Image, ChevronUp, ChevronDown, Layout, Eye, Edit3 } from 'lucide-react';
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

const SlideEditor: React.FC<SlideEditorProps> = React.memo(
  ({
    slide,
    onUpdate,
    onDelete,
    onGenerateImage,
    onMoveUp,
    onMoveDown,
    isLoading,
    slideNumber,
    isFirst,
    isLast,
  }) => {
    const [isPreview, setIsPreview] = useState(false);

    const handleLayoutChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      onUpdate({ ...slide, layout: e.target.value as SlideLayout });
    };

    const renderPreview = () => {
      return (
        <div className={`preview-slide ${slide.layout}`}>
          <h2 className="text-2xl font-bold mb-4">{slide.title}</h2>
          <div dangerouslySetInnerHTML={{ __html: slide.content }} />
          {slide.imageUrl && (
            <img
              src={slide.imageUrl}
              alt="Slide visual"
              className="mt-4 max-w-full h-auto rounded shadow"
            />
          )}
        </div>
      );
    };

    return (
      <div className="card bg-base-100 shadow-xl mb-6">
        <div className="card-body">
          <div className="flex items-center mb-4">
            <h3 className="card-title flex-grow">Slide {slideNumber}</h3>
            <div className="flex space-x-2">
              <button
                onClick={() => setIsPreview(!isPreview)}
                className="btn btn-sm btn-outline"
              >
                {isPreview ? <Edit3 size={16} /> : <Eye size={16} />}
                {isPreview ? 'Edit' : 'Preview'}
              </button>
              <button
                onClick={onMoveUp}
                disabled={isFirst}
                className="btn btn-sm btn-ghost"
              >
                <ChevronUp size={16} />
              </button>
              <button
                onClick={onMoveDown}
                disabled={isLast}
                className="btn btn-sm btn-ghost"
              >
                <ChevronDown size={16} />
              </button>
              <button
                onClick={onDelete}
                className="btn btn-sm btn-error"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
          
          {isPreview ? (
            renderPreview()
          ) : (
            <>
              <div className="flex items-center mb-4">
                <Layout size={20} className="mr-3 text-gray-600" />
                <select
                  value={slide.layout}
                  onChange={handleLayoutChange}
                  className="select select-bordered w-full"
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
                className="input input-bordered w-full mb-4"
              />
              <RichTextEditor
                value={slide.content}
                onChange={(content) => onUpdate({ ...slide, content })}
              />
              <div className="flex items-center mb-4 mt-4">
                <input
                  type="text"
                  value={slide.imagePrompt}
                  onChange={(e) => onUpdate({ ...slide, imagePrompt: e.target.value })}
                  placeholder="Image Prompt"
                  className="input input-bordered flex-grow mr-4"
                />
                <button
                  type="button"
                  onClick={onGenerateImage}
                  className="btn btn-primary"
                  disabled={isLoading || !slide.imagePrompt}
                >
                  <Image className="mr-2" size={20} />
                  {isLoading ? 'Generating...' : 'Generate'}
                </button>
              </div>
              {slide.imageUrl && (
                <img
                  src={slide.imageUrl}
                  alt="Generated visual"
                  className="mt-4 max-w-full h-auto rounded shadow"
                />
              )}
            </>
          )}
        </div>
      </div>
    );
  }
);

export default SlideEditor;
