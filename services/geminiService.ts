import { GoogleGenAI, Type } from "@google/genai";
import type { SaaSBriefData } from '../types';

// Assume process.env.API_KEY is available
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const getTrendingTopic = async (timeRange: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Based on Google search trends over ${timeRange}, what is one of the most popular and rapidly growing search topics related to software needs, business problems, or "how to build an app for X"? Provide only the single topic as a concise phrase, without any preamble or explanation. For example: "AI-powered personal finance tracker" or "Collaborative whiteboard tool for remote teams".`,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });
    return response.text.trim().replace(/"/g, '');
  } catch (error) {
    console.error("Error fetching trending topic:", error);
    throw new Error("Failed to fetch trending topic from Gemini API.");
  }
};

const saasBriefSchema = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING, description: "A creative and catchy name for the SaaS product." },
    motive: { type: Type.STRING, description: "A short, inspiring company motive or mission statement." },
    brandIdentity: {
      type: Type.OBJECT,
      properties: {
        colorPalette: {
          type: Type.ARRAY,
          description: "An array of 3-5 color objects, each with a 'name' (e.g., 'Primary Blue') and its 'hex' code.",
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              hex: { type: Type.STRING },
            },
            required: ['name', 'hex'],
          },
        },
        typography: {
          type: Type.OBJECT,
          properties: {
            fontFamily: { type: Type.STRING, description: "A suitable font family name (e.g., 'Inter', 'Poppins')." },
            description: { type: Type.STRING, description: "A brief description of the typography style." },
          },
          required: ['fontFamily', 'description'],
        },
        style: { type: Type.STRING, description: "A short description of the overall brand style (e.g., 'Minimalist and Modern', 'Playful and Energetic')." },
      },
       required: ['colorPalette', 'typography', 'style'],
    },
    brief: { type: Type.STRING, description: "A concise summary of the SaaS product, its features, and target audience." },
  },
  required: ['name', 'motive', 'brandIdentity', 'brief'],
};

export const generateSaaSConcept = async (topic: string): Promise<{ brief: SaaSBriefData; logoUrl: string; }> => {
  try {
    const briefResponse = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: `Generate a complete SaaS business concept based on the trending topic: "${topic}". Fill out all fields of the provided JSON schema. Do not include advertisements.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: saasBriefSchema,
      },
    });

    const briefData: SaaSBriefData = JSON.parse(briefResponse.text);

    const logoResponse = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: `Generate a single, clean, abstract, minimalist vector logomark for a tech company named "${briefData.name}".
        - Topic: ${topic}
        - Style: Modern, geometric, simple.
        - Background: Solid white background.
        - NO words, letters, or text.
        - NO complex illustrations.
        - NO shadows or gradients.
        - Single, centered object.`,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/png',
          aspectRatio: '1:1',
        },
    });

    if (!logoResponse.generatedImages || logoResponse.generatedImages.length === 0) {
      throw new Error("Logo generation failed.");
    }
    
    const base64ImageBytes: string = logoResponse.generatedImages[0].image.imageBytes;
    const logoUrl = `data:image/png;base64,${base64ImageBytes}`;

    return { brief: briefData, logoUrl };
  } catch (error) {
    console.error("Error generating SaaS concept:", error);
    throw new Error("Failed to generate SaaS concept from Gemini API.");
  }
};