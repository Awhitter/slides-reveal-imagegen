import React from 'react';
import { Module } from '../types';
import RevealSlide from './RevealSlide';

interface ModulePreviewProps {
  module: Module;
}

const ModulePreview: React.FC<ModulePreviewProps> = ({ module }) => {
  return (
    <div className="bg-base-200 p-4 rounded-lg">
      <h2 className="text-2xl font-bold mb-4">{module.title}</h2>
      <div className="space-y-4">
        {module.slides.map((slide, index) => (
          <RevealSlide key={slide.id} slide={slide} index={index} />
        ))}
      </div>
    </div>
  );
};

export default ModulePreview;
