import React, { useState, useCallback } from 'react';
import { UploadIcon } from './icons';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
  const [dragging, setDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageUpload(file);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      onImageUpload(file);
    }
  }, [onImageUpload]);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
  };


  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        className={`border-4 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-colors duration-300 ${dragging ? 'border-brand-primary bg-base-200' : 'border-base-300 hover:border-brand-secondary'}`}
      >
        <input
          type="file"
          id="file-upload"
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
        />
        <label htmlFor="file-upload" className="flex flex-col items-center gap-4 cursor-pointer">
          <UploadIcon />
          <p className="text-xl font-semibold">Drag & drop your image here</p>
          <p className="text-text-secondary">or</p>
          <span className="bg-brand-primary text-white font-bold py-2 px-6 rounded-lg hover:bg-brand-secondary transition-colors">
            Browse File
          </span>
           <p className="text-sm text-gray-500 mt-4">All image formats supported</p>
        </label>
      </div>
    </div>
  );
};
