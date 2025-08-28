
import React from 'react';

const Loader: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <div className="relative h-24 w-24">
        <div className="absolute h-full w-full rounded-full border-4 border-t-indigo-500 border-gray-600 animate-spin"></div>
        <div className="absolute inset-[15%] h-[70%] w-[70%] rounded-full bg-indigo-500/20 animate-pulse"></div>
      </div>
      <p className="mt-4 text-lg font-semibold text-gray-300">Enhancing your photo...</p>
      <p className="text-sm text-gray-400">This may take a few moments.</p>
    </div>
  );
};

export default Loader;
