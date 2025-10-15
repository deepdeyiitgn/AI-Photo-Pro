import React, { useState } from 'react';
import { STYLE_SUGGESTIONS } from '../constants';
import { SparklesIcon } from './icons';

interface StyleSelectorProps {
  onStyleSelect: (prompt: string) => void;
  disabled: boolean;
}

export const StyleSelector: React.FC<StyleSelectorProps> = ({ onStyleSelect, disabled }) => {
  const [customPrompt, setCustomPrompt] = useState('');

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customPrompt.trim()) {
      onStyleSelect(customPrompt.trim());
      setCustomPrompt('');
    }
  };

  return (
    <div className="w-full max-w-4xl p-6 bg-base-200 rounded-2xl shadow-lg h-full flex flex-col">
      <h3 className="text-xl font-bold text-center mb-4 flex items-center justify-center gap-2">
        <SparklesIcon />
        Apply a Style
      </h3>
      <div className="flex-grow overflow-y-auto space-y-4 pr-2">
        {STYLE_SUGGESTIONS.map((category) => (
          <div key={category.category}>
            <h4 className="font-semibold text-text-secondary mb-2">{category.category}</h4>
            <div className="flex flex-wrap gap-2">
              {category.styles.map((style) => (
                <button
                  key={style}
                  onClick={() => onStyleSelect(style)}
                  disabled={disabled}
                  className="px-3 py-1.5 text-sm bg-base-300 text-text-primary rounded-md hover:bg-brand-primary hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {style}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <form onSubmit={handleCustomSubmit} className="flex flex-col sm:flex-row gap-3 mt-6 border-t border-base-300 pt-4">
        <input
          type="text"
          value={customPrompt}
          onChange={(e) => setCustomPrompt(e.target.value)}
          placeholder="Or create your own..."
          disabled={disabled}
          className="flex-grow bg-base-300 border-2 border-base-300 focus:border-brand-secondary focus:ring-0 rounded-lg px-4 py-2 text-text-primary placeholder-text-secondary outline-none transition-colors"
        />
        <button
          type="submit"
          disabled={disabled || !customPrompt.trim()}
          className="bg-brand-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-brand-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Apply
        </button>
      </form>
    </div>
  );
};
