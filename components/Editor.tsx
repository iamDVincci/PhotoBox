
import React, { useState, useEffect } from 'react';
import { editStudioPhoto } from '../services/geminiService';
import ImageUploader from './ImageUploader';
import Loader from './Loader';
import DownloadIcon from './icons/DownloadIcon';
import SparklesIcon from './icons/SparklesIcon';

interface EditorProps {
  initialImageBase64: string;
  onImageUpdate: (base64: string) => void;
}

const Editor: React.FC<EditorProps> = ({ initialImageBase64, onImageUpdate }) => {
  const [imageToEdit, setImageToEdit] = useState<{ file: File | null, base64: string }>({ file: null, base64: initialImageBase64 });
  const [referenceImage, setReferenceImage] = useState<{ file: File, base64: string } | null>(null);
  const [prompt, setPrompt] = useState('');
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setImageToEdit({ file: null, base64: initialImageBase64 });
    setEditedImage(null);
    setPrompt('');
    setReferenceImage(null);
  }, [initialImageBase64]);

  const handleImageToEditUpload = (file: File, base64: string) => {
    setImageToEdit({ file, base64 });
    onImageUpdate(base64);
    setEditedImage(null);
  };

  const handleReferenceUpload = (file: File, base64: string) => {
    setReferenceImage({ file, base64 });
  };

  const handleApplyEdits = async () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt to describe your edits.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setEditedImage(null);

    try {
      const mimeTypeToEdit = imageToEdit.file?.type ?? 'image/png';
      const result = await editStudioPhoto(
        imageToEdit.base64,
        mimeTypeToEdit,
        prompt,
        referenceImage ? { base64: referenceImage.base64, mimeType: referenceImage.file.type } : undefined
      );
      setEditedImage(result);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred during image editing.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDownload = () => {
    const imageToDownload = editedImage || imageToEdit.base64;
    const link = document.createElement('a');
    link.href = `data:image/png;base64,${imageToDownload}`;
    link.download = 'edited_photo.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const displayImage = editedImage || imageToEdit.base64;

  return (
    <section className="bg-gray-800/20 border border-gray-700 rounded-2xl p-4 sm:p-6 shadow-2xl">
        <header className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
                Creative Editor
            </h2>
            <p className="mt-2 text-lg text-gray-400">
                Refine your portrait with text prompts and reference images.
            </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="flex flex-col gap-4 items-center">
                <div className="w-full bg-gray-800/50 p-4 rounded-2xl flex items-center justify-center min-h-[400px] aspect-square">
                    {isLoading ? <Loader /> : error ? (
                         <div className="text-center text-red-400">
                            <h3 className="text-xl font-semibold mb-2">Editing Failed</h3>
                            <p className="text-sm">{error}</p>
                        </div>
                    ) : (
                        <img src={`data:image/png;base64,${displayImage}`} alt="Image to edit" className="object-contain h-full w-full rounded-lg shadow-lg"/>
                    )}
                </div>
                {editedImage && !isLoading && (
                    <button onClick={handleDownload} className="w-full sm:w-auto flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-300">
                        <DownloadIcon />
                        Download Edited Photo
                    </button>
                )}
            </div>
            <div className="flex flex-col gap-6">
                <div>
                    <h3 className="text-xl font-bold mb-1 text-gray-200">1. Image to Edit</h3>
                    <p className="text-gray-400 mb-4">This is the image you'll be editing. You can also upload a new one.</p>
                    <ImageUploader id="editor-image-to-edit" onImageUpload={handleImageToEditUpload} initialPreview={`data:image/png;base64,${imageToEdit.base64}`} />
                </div>
                <div>
                    <h3 className="text-xl font-bold mb-1 text-gray-200">2. Describe Your Edits</h3>
                    <p className="text-gray-400 mb-4">e.g., "Change the jacket to leather" or "Give her a confident smile".</p>
                    <textarea
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Change hair to blonde, add a subtle smile..."
                        className="w-full h-28 p-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none transition"
                        aria-label="Editing prompt"
                    />
                </div>
                <div>
                    <h3 className="text-xl font-bold mb-1 text-gray-200">3. Add Reference (Optional)</h3>
                    <p className="text-gray-400 mb-4">Upload an image for style, pose, or clothing reference.</p>
                    <ImageUploader id="editor-reference-image" onImageUpload={handleReferenceUpload} />
                </div>
                 <button
                    onClick={handleApplyEdits}
                    disabled={isLoading || !prompt.trim()}
                    className="w-full flex items-center justify-center gap-3 bg-purple-600 hover:bg-purple-500 disabled:bg-purple-800 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105"
                >
                    {isLoading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Applying Edits...
                        </>
                    ) : (
                        <>
                            <SparklesIcon />
                            Apply Edits
                        </>
                    )}
                </button>
            </div>
        </div>
    </section>
  );
};

export default Editor;