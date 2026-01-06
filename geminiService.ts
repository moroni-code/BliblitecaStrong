import { GoogleGenAI, Type } from "@google/genai";
import { StrongInfo } from "./types";

const BIBLE_CACHE_KEY = 'bible_cache_v4';
const STRONG_CACHE_KEY = 'strong_cache_v4';

const getCache = (key: string) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
};

const setCache = (key: string, data: any) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn("Error de cache:", e);
  }
};

export const getStrongDefinition = async (word: string, testament: string): Promise<StrongInfo> => {
  // Inicialización siguiendo las reglas oficiales del SDK
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
  
  const cacheKey = `${testament}_${word.toLowerCase()}`;
  const cache = getCache(STRONG_CACHE_KEY);

  if (cache[cacheKey]) return cache[cacheKey];

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Proporciona información del Diccionario Strong para la palabra "${word}". 
      CONTEXTO: Es una traducción del ${testament}.
      RESPONDE ÚNICAMENTE UN OBJETO JSON con estas propiedades: code, original, transliteration, pronunciation, definition.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            code: { type: Type.STRING },
            original: { type: Type.STRING },
            transliteration: { type: Type.STRING },
            pronunciation: { type: Type.STRING },
            definition: { type: Type.STRING },
          },
          required: ["code", "original", "transliteration", "pronunciation", "definition"],
        },
      },
    });

    // Se accede a .text directamente como propiedad
    const result = JSON.parse(response.text || "{}") as StrongInfo;
    cache[cacheKey] = result;
    setCache(STRONG_CACHE_KEY, cache);
    return result;
  } catch (error) {
    console.error("Strong API Error:", error);
    throw new Error("No se pudo obtener la definición.");
  }
};

export const getBibleVerses = async (book: string, chapter: number): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
  const cacheKey = `${book}_${chapter}`;
  const cache = getCache(BIBLE_CACHE_KEY);

  if (cache[cacheKey]) return cache[cacheKey];

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Genera el capítulo ${chapter} de ${book} de la Biblia Reina Valera 1960. 
      Formato: [número] [texto]. 
      IMPORTANTE: Encierra entre doble corchete [[palabra]] exactamente las 5 palabras con mayor significado teológico de cada versículo para habilitar el estudio Strong.`,
    });
    
    const result = response.text || "";
    cache[cacheKey] = result;
    setCache(BIBLE_CACHE_KEY, cache);
    return result;
  } catch (error) {
    console.error("Bible API Error:", error);
    throw new Error("Error al cargar las escrituras.");
  }
};
