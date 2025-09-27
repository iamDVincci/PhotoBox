
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
  },
  {
    id: 'golden_hour',
    name: 'Golden Hour',
    promptSuffix: 'Simulate the warm, soft, and directional light of the golden hour. The background should be a simple studio setup, but the lighting should feel like a setting sun, casting a beautiful, flattering glow on the subject.'
  },
  {
    id: 'spotlight',
    name: 'Dramatic Spotlight',
    promptSuffix: 'Create a dramatic, low-key portrait. Use a single, hard light source (like a spotlight) to illuminate the subject, creating strong highlights and deep shadows. The background should be completely black to make the subject the sole focus.'
  },
  {
    id: 'color_pop',
    name: 'Color Pop',
    promptSuffix: "Place the subject against a vibrant, saturated, solid-color background like electric blue or hot pink. The lighting on the subject should be clean and bright. Ensure the background color complements or stylishly contrasts with the subject's attire."
  },
  {
    id: 'corporate',
    name: 'Corporate',
    promptSuffix: 'Produce a bright, professional corporate headshot. The lighting should be even and flattering, minimizing shadows. The background should be a clean, modern, out-of-focus office environment or a solid light-colored wall.'
  },
  {
    id: 'vintage_film',
    name: 'Vintage Film',
    promptSuffix: 'Emulate the aesthetic of a vintage film portrait from the 1970s. Apply a subtle film grain, slightly desaturated colors with a warm tint, and soft focus. The background should be a simple, textured studio wall with a vintage color palette.'
  },
  {
    id: 'neon_noir',
    name: 'Neon Noir',
    promptSuffix: 'Craft a modern, moody portrait illuminated by neon lights. The scene should be dark, with vibrant neon colors (like pink, blue, or purple) casting colored light and reflections onto the subject. The background should be a dark, minimalist urban-inspired setting.'
  }
];
