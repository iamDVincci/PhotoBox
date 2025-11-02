import React, { useState, useCallback, useRef } from 'react';
import { generateStudioPhoto, cleanUpPhoto } from './services/geminiService';
import { StylePreset, AspectRatio } from './types';
import { STYLE_PRESETS, ASPECT_RATIOS } from './constants';
import ImageUploader from './components/ImageUploader';
import StyleSelector from './components/StyleSelector';
import OutputDisplay from './components/OutputDisplay';
import SparklesIcon from './components/icons/SparklesIcon';
import Editor from './components/Editor';
import AspectRatioSelector from './components/AspectRatioSelector';

const App: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<{ file: File; base64: string } | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<StylePreset>(STYLE_PRESETS[0]);
  const [selectedAspectRatio, setSelectedAspectRatio] = useState<AspectRatio>(ASPECT_RATIOS[0]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [imageToEdit, setImageToEdit] = useState<string | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  const handleImageUpload = (file: File, base64: string) => {
    setOriginalImage({ file, base64 });
    setGeneratedImage(null);
    setImageToEdit(null);
    setError(null);
  };

  const handleGeneration = useCallback(async () => {
    if (!originalImage) {
      setError('Please upload an image first.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);
    setImageToEdit(null);

    try {
      const mimeType = originalImage.file.type;
      const result = await generateStudioPhoto(
        originalImage.base64,
        mimeType,
        selectedStyle,
        selectedAspectRatio.value
      );
      setGeneratedImage(result);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred during image generation.');
    } finally {
      setIsLoading(false);
    }
  }, [originalImage, selectedStyle, selectedAspectRatio]);

  const handleCleanUp = useCallback(async () => {
    if (!originalImage) {
      setError('Please upload an image first.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);
    setImageToEdit(null); // Close editor if open

    try {
      const mimeType = originalImage.file.type;
      const result = await cleanUpPhoto(originalImage.base64, mimeType);
      setGeneratedImage(result);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred during image clean up.');
    } finally {
      setIsLoading(false);
    }
  }, [originalImage]);

  const handleForwardToEditor = useCallback((base64Image: string) => {
    setImageToEdit(base64Image);
    setTimeout(() => {
        editorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans flex flex-col items-center p-4 sm:p-6 md:p-8">
      <header className="w-full max-w-6xl text-center mb-8">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-600">
          Studio Photo AI
        </h1>
        <p className="mt-2 text-lg text-gray-400">
          Transform your casual photos into professional studio portraits.
        </p>
      </header>

      <div className="w-full max-w-6xl flex flex-col gap-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700 shadow-2xl flex flex-col gap-6">
            <div>
              <h2 className="text-2xl font-bold mb-1 text-gray-200">1. Upload Your Photo</h2>
              <p className="text-gray-400 mb-4">Select a clear portrait photo for the best results.</p>
              <ImageUploader id="main-image-upload" onImageUpload={handleImageUpload} />
            </div>

            {originalImage && (
              <>
                <div>
                  <h2 className="text-2xl font-bold mb-1 text-gray-200">2. Choose an Action</h2>
                  <p className="text-gray-400 mb-4">Select a style preset or clean up the original photo.</p>
                  <StyleSelector
                    presets={STYLE_PRESETS}
                    selectedPreset={selectedStyle}
                    onSelectPreset={setSelectedStyle}
                    onCleanUp={handleCleanUp}
                  />
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-1 text-gray-200">3. Choose Aspect Ratio</h2>
                  <p className="text-gray-400 mb-4">Select the final dimensions for your photo. (Only for style generation)</p>
                  <AspectRatioSelector
                    ratios={ASPECT_RATIOS}
                    selectedRatio={selectedAspectRatio}
                    onSelectRatio={setSelectedAspectRatio}
                  />
                </div>

                <button
                  onClick={handleGeneration}
                  disabled={isLoading || !originalImage}
                  className="w-full flex items-center justify-center gap-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      <SparklesIcon />
                      Generate With Style
                    </>
                  )}
                </button>
              </>
            )}
          </div>
          
          <div className="bg-gray-800/50 p-6 rounded-2xl border border-gray-700 shadow-2xl flex items-center justify-center min-h-[400px] lg:min-h-0">
            <OutputDisplay
              originalImage={originalImage?.base64 ?? null}
              generatedImage={generatedImage}
              isLoading={isLoading}
              error={error}
              onEdit={handleForwardToEditor}
            />
          </div>
        </div>

        {imageToEdit && (
          <div ref={editorRef}>
            <Editor 
              initialImageBase64={imageToEdit} 
              onImageUpdate={setImageToEdit}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default App;