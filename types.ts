export type ProcessStep = 'idle' | 'analyzing' | 'enhancing' | 'editing';
export type ActiveTool = 'style' | 'magic-erase' | 'remove-bg' | 'crop' | 'convert';

export interface AppState {
  originalImage: {
    base64: string;
    mimeType: string;
  } | null;
  enhancedImage: string | null; // The initial high-res version
  currentImage: string | null; // The image currently being edited
  styledImage?: string | null; // Kept for potential future use
  qualityAnalysis: string | null;
  isLoading: boolean;
  loadingMessage: string;
  error: string | null;
  currentStep: ProcessStep;
  activeTool: ActiveTool;
  history: string[];
  historyIndex: number;
  maskImage: string | null; // base64 of the black and white mask for eraser
}
