import React from 'react';
import { DownloadIcon } from './icons';

interface DownloadButtonProps {
    canvasRef: React.RefObject<HTMLCanvasElement>;
}

export const DownloadButton: React.FC<DownloadButtonProps> = ({ canvasRef }) => {
    const handleDownload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        
        // Create a temporary canvas to apply watermark without affecting the display
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        const ctx = tempCanvas.getContext('2d');
        if (!ctx) return;

        // Draw the current image from the main canvas
        ctx.drawImage(canvas, 0, 0);
        
        // Apply watermark
        ctx.globalAlpha = 0.3; // 30% opacity
        ctx.fillStyle = 'white';
        const fontSize = Math.max(18, canvas.width / 40); // Responsive font size
        ctx.font = `bold ${fontSize}px sans-serif`;
        ctx.textAlign = 'right';
        ctx.textBaseline = 'bottom';
        const watermarkText = "edited by deepdey.official ~ instagram";
        const padding = fontSize;
        ctx.fillText(watermarkText, tempCanvas.width - padding, tempCanvas.height - padding);

        // Trigger download
        const link = document.createElement('a');
        link.download = 'edited by deepdey.official ~ instagram.png';
        link.href = tempCanvas.toDataURL('image/png');
        link.click();
    };

    return (
        <button
            onClick={handleDownload}
            className="mt-8 flex items-center justify-center gap-3 bg-brand-primary text-white font-bold py-3 px-8 rounded-lg hover:bg-brand-secondary transition-colors shadow-lg"
        >
            <DownloadIcon />
            Download Image
        </button>
    );
};
