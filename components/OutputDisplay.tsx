import React from 'react';
import Loader from './Loader';
import DownloadIcon from './icons/DownloadIcon';
import PencilIcon from './icons/PencilIcon';

interface OutputDisplayProps {
  originalImage: string | null;
  generatedImage: string | null;
  isLoading: boolean;
  error: string | null;
  onEdit?: (base64Image: string) => void;
}

const OutputDisplay: React.FC<OutputDisplayProps> = ({ originalImage, generatedImage, isLoading, error, onEdit }) => {
  const handleDownload = () => {
    if (generatedImage) {
      const link = document.createElement('a');
      link.href = `data:image/png;base64,${generatedImage}`;
      link.download = 'studio_photo.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="text-center text-red-400">
        <h3 className="text-xl font-semibold mb-2">Operation Failed</h3>
        <p className="text-sm">{error}</p>
      </div>
    );
  }
  
  if (generatedImage) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center gap-4">
        <div className="w-full aspect-w-1 aspect-h-1 relative">
            <img src={`data:image/png;base64,${generatedImage}`} alt="Generated studio" className="object-contain w-full h-full rounded-lg shadow-2xl" />
        </div>
        <div className="mt-4 w-full flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={handleDownload}
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-300"
          >
            <DownloadIcon />
            Download
          </button>
          {onEdit && (
            <button
              onClick={() => onEdit(generatedImage)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 px-6 rounded-lg transition-colors duration-300"
            >
              <PencilIcon />
              Edit Photo
            </button>
          )}
        </div>
      </div>
    );
  }

  if (originalImage) {
     return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-4 opacity-50">
            <div className="w-full aspect-w-1 aspect-h-1 relative">
                <img src={`data:image/png;base64,${originalImage}`} alt="Original upload" className="object-contain w-full h-full rounded-lg" />
            </div>
            <p className="text-gray-400 mt-2">Your original image</p>
        </div>
     );
  }

  return (
    <div className="text-center text-gray-500">
      <h3 className="text-xl font-semibold">Your enhanced photo will appear here</h3>
      <p className="mt-2">Upload an image and choose a style to get started.</p>
    </div>
  );
};

export default OutputDisplay;