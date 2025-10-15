
import React from 'react';
import { CameraIcon } from './icons';

export const Header: React.FC = () => {
  return (
    <header className="w-full max-w-7xl mx-auto py-6 mb-8 text-center">
      <div className="flex items-center justify-center gap-4">
        <CameraIcon />
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight bg-gradient-to-r from-brand-primary to-brand-secondary text-transparent bg-clip-text">
          AI Photo Pro
        </h1>
      </div>
      <p className="mt-4 text-lg text-text-secondary">
        Enhance and stylize your photos with the power of Gemini AI.
      </p>
    </header>
  );
};
