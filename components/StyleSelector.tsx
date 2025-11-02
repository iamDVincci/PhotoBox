import React from 'react';
import type { StylePreset } from '../types';
import SunIcon from './icons/SunIcon';

interface StyleSelectorProps {
  presets: StylePreset[];
  selectedPreset: StylePreset;
  onSelectPreset: (preset: StylePreset) => void;
  onCleanUp: () => void;
}

const StyleSelector: React.FC<StyleSelectorProps> = ({ presets, selectedPreset, onSelectPreset, onCleanUp }) => {
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
       <button
        onClick={onCleanUp}
        className="col-span-2 sm:col-span-4 mt-2 flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 bg-blue-600 text-white hover:bg-blue-500 ring-2 ring-blue-500"
      >
        <SunIcon />
        Clean Up Original Photo
      </button>
    </div>
  );
};

export default StyleSelector;