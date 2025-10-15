import React from 'react';
import type { ActiveTool } from '../types';
import { SparklesIcon, EraserIcon, BackgroundIcon, CropIcon, ConvertIcon, UndoIcon, RedoIcon } from './icons';

interface ToolbarProps {
  activeTool: ActiveTool;
  onToolChange: (tool: ActiveTool) => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onMagicEraseApply: () => void;
  isEraseActive: boolean;
}

const ToolButton: React.FC<{
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
  disabled?: boolean;
}> = ({ label, icon, isActive, onClick, disabled = false }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    title={label}
    aria-label={label}
    className={`flex items-center justify-start w-full p-3 rounded-lg transition-colors text-left ${
      isActive ? 'bg-brand-primary text-white' : 'hover:bg-base-300'
    } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
  >
    {icon}
    <span className="ml-3 font-semibold">{label}</span>
  </button>
);

export const Toolbar: React.FC<ToolbarProps> = ({ activeTool, onToolChange, onUndo, onRedo, canUndo, canRedo, onMagicEraseApply, isEraseActive }) => {
  return (
    <div className="w-full p-4 bg-base-200 rounded-2xl shadow-lg flex flex-col gap-2">
      <div className="flex items-center gap-2 border-b border-base-300 pb-2 mb-2">
         <button onClick={onUndo} disabled={!canUndo} title="Undo" aria-label="Undo" className="p-2 rounded-md hover:bg-base-300 disabled:opacity-50 disabled:cursor-not-allowed"><UndoIcon /></button>
         <button onClick={onRedo} disabled={!canRedo} title="Redo" aria-label="Redo" className="p-2 rounded-md hover:bg-base-300 disabled:opacity-50 disabled:cursor-not-allowed"><RedoIcon /></button>
      </div>

      <ToolButton label="Style" icon={<SparklesIcon />} isActive={activeTool === 'style'} onClick={() => onToolChange('style')} />
      <ToolButton label="Magic Erase" icon={<EraserIcon />} isActive={activeTool === 'magic-erase'} onClick={() => onToolChange('magic-erase')} />
      {activeTool === 'magic-erase' && (
          <div className="pl-4 pr-2 pb-2">
              <p className="text-sm text-text-secondary mb-2">Draw on the image to select areas to remove.</p>
              <button
                onClick={onMagicEraseApply}
                disabled={!isEraseActive}
                className="w-full bg-brand-secondary text-white font-bold py-2 px-4 rounded-lg hover:bg-brand-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                  Apply Eraser
              </button>
          </div>
      )}
      <ToolButton label="Remove BG" icon={<BackgroundIcon />} isActive={activeTool === 'remove-bg'} onClick={() => onToolChange('remove-bg')} />

      {/* Placeholder tools */}
      <div className="border-t border-base-300 pt-2 mt-2">
          <p className="text-xs text-text-secondary px-3 pb-2">Coming Soon</p>
          <ToolButton label="Crop" icon={<CropIcon />} isActive={activeTool === 'crop'} onClick={() => {}} disabled />
          <ToolButton label="Convert" icon={<ConvertIcon />} isActive={activeTool === 'convert'} onClick={() => {}} disabled />
      </div>
    </div>
  );
};
