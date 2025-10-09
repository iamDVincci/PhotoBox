
import React from 'react';
import type { AspectRatio } from '../types';

interface AspectRatioSelectorProps {
  ratios: AspectRatio[];
  selectedRatio: AspectRatio;
  onSelectRatio: (ratio: AspectRatio) => void;
}

const AspectRatioSelector: React.FC<AspectRatioSelectorProps> = ({ ratios, selectedRatio, onSelectRatio }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
      {ratios.map((ratio) => (
        <button
          key={ratio.id}
          onClick={() => onSelectRatio(ratio)}
          className={`px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800
            ${selectedRatio.id === ratio.id
              ? 'bg-indigo-600 text-white shadow-lg ring-2 ring-indigo-500'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
        >
          {ratio.name}
        </button>
      ))}
    </div>
  );
};

export default AspectRatioSelector;
