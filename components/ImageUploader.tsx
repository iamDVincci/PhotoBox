
import React, { useState, useCallback } from 'react';
import UploadIcon from './icons/UploadIcon';

interface ImageUploaderProps {
  onImageUpload: (file: File, base64: string) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file (PNG, JPG, etc.).');
        setPreview(null);
        return;
      }
      
      setError(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = (reader.result as string).split(',')[1];
        setPreview(reader.result as string);
        onImageUpload(file, base64String);
      };
      reader.onerror = () => {
        setError("Failed to read the file.");
      };
      reader.readAsDataURL(file);
    }
  }, [onImageUpload]);

  return (
    <div>
      <label htmlFor="file-upload" className="cursor-pointer">
        <div className={`relative w-full h-64 border-2 border-dashed border-gray-600 rounded-lg flex flex-col justify-center items-center text-gray-400 hover:border-indigo-500 hover:bg-gray-800 transition-colors duration-300 ${preview ? 'p-2' : ''}`}>
          {preview ? (
            <img src={preview} alt="Image preview" className="object-contain h-full w-full rounded-md" />
          ) : (
            <>
              <UploadIcon />
              <p className="mt-2">Click to upload or drag and drop</p>
              <p className="text-sm">PNG, JPG, WEBP, etc.</p>
            </>
          )}
        </div>
      </label>
      <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default ImageUploader;
