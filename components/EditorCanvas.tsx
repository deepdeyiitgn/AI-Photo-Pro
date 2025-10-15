import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';

interface EditorCanvasProps {
  imageSrc: string;
  isEraseMode: boolean;
  onMaskComplete: (maskBase64: string) => void;
}

export const EditorCanvas = forwardRef<HTMLCanvasElement, EditorCanvasProps>(({ imageSrc, isEraseMode, onMaskComplete }, ref) => {
  const internalCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [image, setImage] = useState<HTMLImageElement | null>(null);

  useImperativeHandle(ref, () => internalCanvasRef.current!);

  // Load image from src
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageSrc;
    img.onload = () => setImage(img);
  }, [imageSrc]);

  // Draw image to canvas when it loads or updates
  useEffect(() => {
    if (image && internalCanvasRef.current) {
      const canvas = internalCanvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Set canvas dimensions to match image
        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(image, 0, 0);
      }
    }
  }, [image]);

  const getMousePos = (e: React.MouseEvent): { x: number; y: number } => {
    const canvas = internalCanvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const startDrawing = (e: React.MouseEvent) => {
    if (!isEraseMode) return;
    const ctx = internalCanvasRef.current?.getContext('2d');
    if (!ctx) return;
    setIsDrawing(true);
    const { x, y } = getMousePos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent) => {
    if (!isDrawing || !isEraseMode) return;
    const ctx = internalCanvasRef.current?.getContext('2d');
    if (!ctx) return;
    const { x, y } = getMousePos(e);
    ctx.lineTo(x, y);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.lineWidth = 40; // Brush size
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isEraseMode || !isDrawing) return;
    setIsDrawing(false);
    const canvas = internalCanvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || !image) return;

    // Create a new canvas for the mask
    const maskCanvas = document.createElement('canvas');
    maskCanvas.width = canvas.width;
    maskCanvas.height = canvas.height;
    const maskCtx = maskCanvas.getContext('2d');
    if (!maskCtx) return;

    // Fill mask with black
    maskCtx.fillStyle = 'black';
    maskCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);
    
    // Get the drawn lines from the main canvas
    maskCtx.drawImage(canvas, 0, 0);

    // Make the drawn lines white and everything else black
    maskCtx.globalCompositeOperation = 'source-in';
    maskCtx.fillStyle = 'white';
    maskCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height);

    const maskBase64 = maskCanvas.toDataURL('image/png').split(',')[1];
    onMaskComplete(maskBase64);

    // Redraw original image to clear the drawing lines from view
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0);
  };

  return (
    <div className="w-full max-w-[512px] aspect-square bg-base-300 rounded-lg shadow-lg overflow-hidden">
        <canvas
            ref={internalCanvasRef}
            className={`w-full h-full object-contain ${isEraseMode ? 'cursor-crosshair' : 'cursor-default'}`}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing} // Stop if mouse leaves canvas
        />
    </div>
  );
});
