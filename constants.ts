
import { StylePreset } from './types';

export const STYLE_PRESETS: StylePreset[] = [
  {
    id: 'neutral',
    name: 'Neutral Studio',
    promptSuffix: 'For the background, use a neutral gray or off-white textured canvas.'
  },
  {
    id: 'gradient',
    name: 'Luxury Gradient',
    promptSuffix: 'For the background, use a subtle, luxurious dark-to-light gradient, like deep blue to black.'
  },
  {
    id: 'monochrome',
    name: 'Monochrome',
    promptSuffix: 'Convert the entire image to a high-contrast, professional black and white portrait. Pay close attention to tones and shadows. For the background, use a solid dark gray.'
  },
  {
    id: 'lifestyle',
    name: 'Lifestyle',
    promptSuffix: 'Instead of a studio background, create a slightly out-of-focus, high-end indoor environment that looks natural and aspirational, like a modern apartment or an upscale cafe. The lighting should feel natural but perfected.'
  }
];
