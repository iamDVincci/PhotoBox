
import { GoogleGenAI, Modality } from "@google/genai";
import type { StylePreset } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const BASE_PROMPT = `Act as an AI image enhancement specialist. Your goal is to transform this casual, low-quality personal photo into a high-resolution, professional studio portrait. Follow these steps precisely:
1. Analyze the input image for resolution, lighting, color balance, noise, and background.
2. Upscale and sharpen the image, applying super-resolution to recover details.
3. Simulate soft, diffused studio lighting. Balance highlights and reduce harsh shadows.
4. Apply professional color grading for vibrant, natural skin tones.
5. Remove the existing background and replace it with a clean, professional studio backdrop as specified.
6. Retouch skin naturally: smooth texture, enhance eyes, remove blemishes, and adjust contrast without over-editing.
7. Enhance the quality and texture of clothing and accessories.
Constraint: Preserve the person’s identity and proportions. Avoid artificial or unrealistic results. The final aesthetic should be comparable to high-end fashion or editorial photography.`;

export const generateStudioPhoto = async (
  base64ImageData: string,
  mimeType: string,
  style: StylePreset,
  aspectRatio: string
): Promise<string> => {
  try {
    const fullPrompt = `${BASE_PROMPT}\n\nStyle-specific instruction: ${style.promptSuffix}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64ImageData,
              mimeType: mimeType,
            },
          },
          {
            text: fullPrompt,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
        imageConfig: {
          aspectRatio: aspectRatio,
        },
      },
    });
    
    // Find the image part in the response
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return part.inlineData.data;
      }
    }

    throw new Error('No image was generated. The model may have refused the request.');

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to generate image: ${error.message}`);
    }
    throw new Error("An unknown error occurred while communicating with the Gemini API.");
  }
};


export const editStudioPhoto = async (
  base64ImageToEdit: string,
  mimeTypeToEdit: string,
  prompt: string,
  referenceImage?: { base64: string; mimeType: string }
): Promise<string> => {
  try {
    const parts: any[] = [
      {
        text: `You are an expert AI photo editor. Edit the following image based on my instructions. The key is to preserve the person's identity and facial features while making the requested changes.`,
      },
      {
        inlineData: { data: base64ImageToEdit, mimeType: mimeTypeToEdit },
      },
    ];

    if (referenceImage) {
      parts.push({
        text: 'Use this second image as a style and content reference for the edit:',
      });
      parts.push({
        inlineData: {
          data: referenceImage.base64,
          mimeType: referenceImage.mimeType,
        },
      });
    }

    parts.push({ text: `My instruction is: "${prompt}"` });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return part.inlineData.data;
      }
    }

    throw new Error('No image was generated in the edit. The model may have refused the request.');
  } catch (error) {
    console.error("Error calling Gemini API for editing:", error);
    if (error instanceof Error) {
      throw new Error(`Failed to edit image: ${error.message}`);
    }
    throw new Error("An unknown error occurred while communicating with the Gemini API for editing.");
  }
};

export const cleanUpPhoto = async (
  base64ImageData: string,
  mimeType: string,
): Promise<string> => {
  const PROMPT = `Act as an expert AI photo retoucher. Your task is to perform a non-destructive clean-up and enhancement of the provided image.

Your Goal: Make the image look professionally edited, as if by a high-end photographer, by improving its technical qualities without changing any of its core content.

Strict Instructions (DO NOT DEVIATE):
1. DO NOT change the subject's facial features, expression, hair, or identity.
2. DO NOT alter the clothing or any accessories the subject is wearing.
3. DO NOT change or replace the background of the image. The original background must be preserved.
4. DO NOT add, remove, or reposition any objects in the scene.

Enhancements to Perform:
- Lighting & Contrast: Subtly improve the lighting to make it more dynamic. Enhance contrast to make the image pop, ensuring you don't crush the blacks or blow out the highlights.
- Color & Saturation: Perform professional color correction. Enhance the vibrancy and saturation of colors to make them richer and more appealing, but keep them looking natural. Ensure skin tones are accurate and pleasing.
- Sharpness & Detail: Increase the overall sharpness and clarity of the image. Bring out fine details and textures in the subject and the environment.
- Noise Reduction: If any digital noise is present, reduce it carefully without sacrificing important details.

The final output must be a higher-quality version of the exact same photo, not a different photo.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64ImageData,
              mimeType: mimeType,
            },
          },
          {
            text: PROMPT,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });
    
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return part.inlineData.data;
      }
    }

    throw new Error('No image was generated during clean up. The model may have refused the request.');

  } catch (error) {
    console.error("Error calling Gemini API for clean up:", error);
    if (error instanceof Error) {
        throw new Error(`Failed to clean up image: ${error.message}`);
    }
    throw new Error("An unknown error occurred while communicating with the Gemini API for clean up.");
  }
};
