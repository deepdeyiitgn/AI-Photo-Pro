import React, { useState, useCallback, useRef } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { EditorCanvas } from './components/EditorCanvas';
import { StyleSelector } from './components/StyleSelector';
import { Loader } from './components/Loader';
import { InfoCard } from './components/InfoCard';
import { Toolbar } from './components/Toolbar';
import { DownloadButton } from './components/DownloadButton';
import { analyzeImageQuality, enhanceImage, applyStyleToImage, removeBackground, magicErase } from './services/geminiService';
import type { AppState, ProcessStep, ActiveTool } from './types';
import { ResetIcon } from './components/icons';

const App: React.FC = () => {
  const initialState: AppState = {
    originalImage: null,
    enhancedImage: null,
    currentImage: null,
    qualityAnalysis: null,
    isLoading: false,
    loadingMessage: '',
    error: null,
    currentStep: 'idle',
    activeTool: 'style',
    history: [],
    historyIndex: -1,
    maskImage: null,
  };

  const [state, setState] = useState<AppState>(initialState);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const updateStateWithHistory = (newImage: string | null) => {
    setState(prevState => {
      const newHistory = prevState.history.slice(0, prevState.historyIndex + 1);
      newHistory.push(prevState.currentImage!);
      return {
        ...prevState,
        currentImage: newImage,
        history: newHistory,
        historyIndex: newHistory.length - 1,
        isLoading: false,
        loadingMessage: '',
      };
    });
  };
  
  const handleReset = () => {
    setState(initialState);
  };

  const handleImageUpload = async (file: File) => {
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = (reader.result as string).split(',')[1];
        const mimeType = file.type;

        setState({ ...initialState, originalImage: { base64, mimeType }, currentStep: 'analyzing', isLoading: true, loadingMessage: 'Analyzing image quality...' });

        const analysis = await analyzeImageQuality(base64, mimeType);
        setState(prevState => ({ ...prevState, qualityAnalysis: analysis, currentStep: 'enhancing', loadingMessage: 'Enhancing to high resolution...' }));

        const enhanced = await enhanceImage(base64, mimeType);
        setState(prevState => ({
          ...prevState,
          enhancedImage: enhanced,
          currentImage: enhanced,
          currentStep: 'editing',
          isLoading: false,
          history: [],
          historyIndex: -1,
        }));
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error(err);
      setState(prevState => ({ ...prevState, isLoading: false, error: 'Failed to process image. Please try again.' }));
    }
  };

  const handleStyleSelect = useCallback(async (stylePrompt: string) => {
    if (!state.currentImage || !state.originalImage) return;
    setState(prevState => ({ ...prevState, isLoading: true, loadingMessage: `Applying "${stylePrompt}" style...` }));
    try {
      const styled = await applyStyleToImage(state.currentImage, state.originalImage.mimeType, stylePrompt);
      updateStateWithHistory(styled);
    } catch (err) {
      console.error(err);
      setState(prevState => ({ ...prevState, isLoading: false, error: 'Failed to apply style. Please try again.' }));
    }
  }, [state.currentImage, state.originalImage]);

  const handleToolAction = useCallback(async (tool: ActiveTool) => {
    if (!state.currentImage || !state.originalImage) return;

    setState(prevState => ({ ...prevState, isLoading: true, loadingMessage: `Applying ${tool}...` }));
    
    try {
      let result: string | null = null;
      if (tool === 'remove-bg') {
        result = await removeBackground(state.currentImage, state.originalImage.mimeType);
      } else if (tool === 'magic-erase' && state.maskImage) {
        result = await magicErase(state.currentImage, state.originalImage.mimeType, state.maskImage);
      }
      if (result) {
        updateStateWithHistory(result);
        setState(prevState => ({ ...prevState, maskImage: null })); // Clear mask after use
      } else {
        setState(prevState => ({ ...prevState, isLoading: false }));
      }
    } catch (err) {
      console.error(err);
      setState(prevState => ({ ...prevState, isLoading: false, error: `Failed to perform ${tool}. Please try again.` }));
    }
  }, [state.currentImage, state.originalImage, state.maskImage]);

  const handleUndo = () => {
    if (state.historyIndex > 0) {
      setState(prevState => ({
        ...prevState,
        currentImage: prevState.history[prevState.historyIndex],
        historyIndex: prevState.historyIndex - 1,
      }));
    } else if (state.historyIndex === 0) {
        // At the first history item, undoing goes back to the initial enhanced image
         setState(prevState => ({
            ...prevState,
            currentImage: prevState.enhancedImage,
            historyIndex: -1,
        }));
    }
  };

  const handleRedo = () => {
     if (state.historyIndex < state.history.length - 1) {
        // Redoing from initial state
        if (state.historyIndex === -1) {
             setState(prevState => ({
                ...prevState,
                currentImage: prevState.history[0],
                historyIndex: 0,
            }));
        } else {
            // Redoing from within the history stack
            setState(prevState => ({
                ...prevState,
                currentImage: prevState.history[prevState.historyIndex + 2], // This looks weird, but it's correct
                historyIndex: prevState.historyIndex + 1,
            }));
        }
    }
  };


  const renderContent = () => {
    if (state.isLoading) return <Loader message={state.loadingMessage} />;
    if (state.currentStep === 'idle') return <ImageUploader onImageUpload={handleImageUpload} />;

    if (state.currentStep === 'editing' && state.currentImage && state.originalImage) {
        return (
            <div className="w-full max-w-7xl mx-auto flex flex-col items-center gap-8">
                {state.qualityAnalysis && <InfoCard title="Image Quality Analysis" content={state.qualityAnalysis} />}
                
                <div className="flex flex-col lg:flex-row gap-8 w-full">
                    <div className="w-full lg:w-1/4">
                       <Toolbar 
                         activeTool={state.activeTool}
                         onToolChange={(tool) => setState(prevState => ({ ...prevState, activeTool: tool, maskImage: null }))}
                         onUndo={handleUndo}
                         onRedo={handleRedo}
                         canUndo={state.historyIndex >= 0}
                         canRedo={state.historyIndex < state.history.length - 1}
                         onMagicEraseApply={() => handleToolAction('magic-erase')}
                         isEraseActive={state.activeTool === 'magic-erase' && !!state.maskImage}
                       />
                    </div>
                    <div className="w-full lg:w-2/4 flex justify-center">
                        <EditorCanvas
                            ref={canvasRef}
                            imageSrc={`data:${state.originalImage.mimeType};base64,${state.currentImage}`}
                            isEraseMode={state.activeTool === 'magic-erase'}
                            onMaskComplete={(mask) => setState(prevState => ({...prevState, maskImage: mask}))}
                        />
                    </div>
                    <div className="w-full lg:w-1/4">
                        {state.activeTool === 'style' && (
                            <StyleSelector onStyleSelect={handleStyleSelect} disabled={state.isLoading} />
                        )}
                    </div>
                </div>

                <DownloadButton canvasRef={canvasRef} />

                {state.error && <p className="text-red-400 mt-4">{state.error}</p>}
            </div>
        );
    }
    
    return null;
  };

  return (
    <div className="min-h-screen bg-base-100 text-text-primary flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <Header />
      <main className="w-full flex-grow flex flex-col items-center justify-center container mx-auto px-4">
        {renderContent()}
      </main>
      {state.currentStep !== 'idle' && !state.isLoading && (
        <button 
            onClick={handleReset} 
            title="Start Over"
            aria-label="Start Over"
            className="fixed bottom-6 right-6 bg-brand-primary hover:bg-brand-secondary text-white font-bold p-4 rounded-full shadow-lg transition-transform transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-base-100 focus:ring-brand-primary">
            <ResetIcon />
        </button>
      )}
    </div>
  );
};

export default App;
