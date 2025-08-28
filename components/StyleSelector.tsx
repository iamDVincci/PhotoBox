
import React from 'react';
import type { StylePreset } from '../types';

interface StyleSelectorProps {
  presets: StylePreset[];
  selectedPreset: StylePreset;
  onSelectPreset: (preset: StylePreset) => void;
}

const StyleSelector: React.FC<StyleSelectorProps> = ({ presets, selectedPreset, onSelectPreset }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {presets.map((preset) => (
        <button
          key={preset.id}
          onClick={() => onSelectPreset(preset)}
          className={`px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800
            ${selectedPreset.id === preset.id
              ? 'bg-indigo-600 text-white shadow-lg ring-2 ring-indigo-500'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
        >
          {preset.name}
        </button>
      ))}
    </div>
  );
};

export default StyleSelector;
