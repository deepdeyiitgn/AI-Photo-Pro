import { GoogleGenAI, Modality } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });
const textModel = 'gemini-2.5-flash';
const imageModel = 'gemini-2.5-flash-image';

const fileToGenerativePart = (base64: string, mimeType: string) => {
  return {
    inlineData: {
      data: base64,
      mimeType,
    },
  };
};

export const analyzeImageQuality = async (base64Image: string, mimeType: string): Promise<string> => {
  try {
    const imagePart = fileToGenerativePart(base64Image, mimeType);
    const prompt = "Analyze the quality of this image. Describe its resolution, sharpness, lighting, and any noticeable flaws like noise or compression artifacts. Provide a one-sentence summary followed by bullet points. Format the response as simple text, not markdown.";
    
    const response = await ai.models.generateContent({
        model: textModel,
        contents: { parts: [imagePart, {text: prompt}] },
    });
    
    return response.text;
  } catch (error) {
    console.error("Error analyzing image quality:", error);
    throw new Error("Failed to analyze image quality with Gemini API.");
  }
};

const generateImageWithPrompt = async (base64Image: string, mimeType: string, prompt: string): Promise<string> => {
    try {
        const imagePart = fileToGenerativePart(base64Image, mimeType);
        const response = await ai.models.generateContent({
            model: imageModel,
            contents: {
                parts: [
                    imagePart,
                    { text: prompt },
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });

        const parts = response.candidates?.[0]?.content?.parts;
        if (parts) {
            for (const part of parts) {
                if (part.inlineData) {
                    return part.inlineData.data;
                }
            }
        }
        throw new Error("No image data returned from API.");
    } catch (error) {
        console.error(`Error generating image with prompt "${prompt}":`, error);
        throw new Error("Failed to generate image with Gemini API.");
    }
};


export const enhanceImage = async (base64Image: string, mimeType: string): Promise<string> => {
  const prompt = "Enhance this image to a high-resolution, professional quality photograph. Improve sharpness, clarity, color balance, and lighting to make it look like it was taken with a high-end camera. Do not add or remove any objects or characters from the original image.";
  return generateImageWithPrompt(base64Image, mimeType, prompt);
};

export const applyStyleToImage = async (base64Image: string, mimeType: string, stylePrompt: string): Promise<string> => {
  const prompt = `Re-edit this photograph to have a ${stylePrompt} aesthetic. Apply the necessary color grading, contrast, and lighting adjustments to achieve this look. Maintain the original composition and subjects.`;
  return generateImageWithPrompt(base64Image, mimeType, prompt);
};

export const removeBackground = async (base64Image: string, mimeType: string): Promise<string> => {
    const prompt = "Remove the background from this image completely. The output should be only the main subject on a transparent background. The output image must be a PNG.";
    return generateImageWithPrompt(base64Image, mimeType, prompt);
};

export const magicErase = async (base64Image: string, mimeType: string, maskBase64: string): Promise<string> => {
    try {
        const imagePart = fileToGenerativePart(base64Image, mimeType);
        const maskPart = fileToGenerativePart(maskBase64, 'image/png');
        const prompt = "You will be given two images. The first is the original image, and the second is a mask. Inpaint the area of the original image that corresponds to the white area of the mask. Fill this area seamlessly and realistically based on the surrounding pixels. The output should be the modified original image.";

        const response = await ai.models.generateContent({
            model: imageModel,
            contents: {
                parts: [
                    imagePart,
                    maskPart,
                    { text: prompt },
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });

        const parts = response.candidates?.[0]?.content?.parts;
        if (parts) {
            for (const part of parts) {
                if (part.inlineData && part.inlineData.mimeType.startsWith('image/')) {
                    return part.inlineData.data;
                }
            }
        }
        throw new Error("No image data returned from API for magic erase.");
    } catch (error) {
        console.error("Error performing magic erase:", error);
        throw new Error("Failed to perform magic erase with Gemini API.");
    }
};
