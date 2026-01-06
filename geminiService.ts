
import { GoogleGenAI, Type } from "@google/genai";
import { StrongInfo } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

// Claves para el almacenamiento local
const BIBLE_CACHE_KEY = 'bible_cache_v1';
const STRONG_CACHE_KEY = 'strong_cache_v1';

const getCache = (key: string) => JSON.parse(localStorage.getItem(key) || '{}');
const setCache = (key: string, data: any) => localStorage.setItem(key, JSON.stringify(data));

export const getStrongDefinition = async (word: string, testament: string): Promise<StrongInfo> => {
  const cacheKey = `${testament}_${word.toLowerCase()}`;
  const cache = getCache(STRONG_CACHE_KEY);

  if (cache[cacheKey]) {
    console.log("Cargando definición desde cache local...");
    return cache[cacheKey];
  }

  try {
    const isOldTestament = testament.includes("Antiguo");
    const lang = isOldTestament ? "Hebreo" : "Griego";
    
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Proporciona información del Diccionario Strong para la palabra "${word}". 
      CONTEXTO: Esta palabra proviene del ${testament}.
      REGLA DE ORO DE IDIOMA:
      - Antiguo Testamento: DEBE ser Hebreo (ej. Dios = Elohim, H430).
      - Nuevo Testamento: DEBE ser Griego (ej. Dios = Theos, G2316).
      REGLAS DE RESPUESTA:
      1. Campo "definition": Definición léxica MUY DETALLADA y académica.
      2. CONSISTENCIA: Misma definición para la misma palabra siempre.
      3. Solo significado original, sin frases de uso.`,
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

    const result = JSON.parse(response.text);
    // Guardar en cache
    cache[cacheKey] = result;
    setCache(STRONG_CACHE_KEY, cache);
    
    return result;
  } catch (error) {
    throw new Error("No hay conexión y el contenido no está guardado.");
  }
};

export const getBibleVerses = async (book: string, chapter: number): Promise<string> => {
  const cacheKey = `${book}_${chapter}`;
  const cache = getCache(BIBLE_CACHE_KEY);

  if (cache[cacheKey]) {
    console.log("Cargando capítulo desde cache local...");
    return cache[cacheKey];
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Genera el texto de ${book} capítulo ${chapter} en español (Reina Valera 1960). 
      REGLAS:
      1. Empieza en v1 directamente.
      2. Formato: "[número] [texto]" por línea.
      3. Marca todas las palabras clave con [[palabra]].`,
    });
    
    const result = response.text || "No se pudo cargar.";
    // Guardar en cache
    cache[cacheKey] = result;
    setCache(BIBLE_CACHE_KEY, cache);
    
    return result;
  } catch (error) {
    throw new Error("Offline: Este capítulo no ha sido descargado aún.");
  }
};
