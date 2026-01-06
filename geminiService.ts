import { GoogleGenAI, Type } from "@google/genai";
import { StrongInfo } from "./types";
import { BIBLE_DATA } from "./bibleData";

const BIBLE_CACHE_KEY = 'bible_cache_v21';
const STRONG_CACHE_KEY = 'strong_cache_v21';

const getCache = (key: string) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : {};
  } catch { return {}; }
};

const setCache = (key: string, data: any) => {
  try { localStorage.setItem(key, JSON.stringify(data)); } catch (e) {}
};

// Helper para inicializar la IA con seguridad
const getAIClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API_KEY no configurada en el entorno");
  }
  return new GoogleGenAI({ apiKey });
};

export const getStrongDefinition = async (word: string, testament: string): Promise<StrongInfo> => {
  const ai = getAIClient();
  const cacheKey = `${testament}_${word.toLowerCase()}`;
  const cache = getCache(STRONG_CACHE_KEY);

  if (cache[cacheKey]) return cache[cacheKey];

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `Estudio filológico para la palabra "${word}" en el contexto del ${testament}.`,
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

    const result = JSON.parse(response.text || "{}") as StrongInfo;
    cache[cacheKey] = result;
    setCache(STRONG_CACHE_KEY, cache);
    return result;
  } catch (error) {
    console.error("Error en exégesis:", error);
    throw new Error("No se pudo obtener la definición Strong.");
  }
};

export const getBibleVerses = async (book: string, chapter: number): Promise<{text: string, isLocal: boolean}> => {
  const ai = getAIClient();
  const cacheKey = `${book}_${chapter}`;
  const cache = getCache(BIBLE_CACHE_KEY);

  if (cache[cacheKey]) return { text: cache[cacheKey], isLocal: true };

  let sourceText = "";
  let isFromLocalFile = false;
  
  if (BIBLE_DATA[book] && BIBLE_DATA[book][chapter - 1]) {
    const chapterData = BIBLE_DATA[book][chapter - 1];
    if (chapterData && chapterData.length > 0) {
      sourceText = chapterData.map((v, i) => `[${i + 1}] ${v}`).join("\n");
      isFromLocalFile = true;
    }
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: isFromLocalFile 
        ? `A continuación el texto de la Biblia RVR1960. Tu tarea es identificar las palabras más importantes y devolver el mismo texto pero etiquetando esas palabras con su código Strong usando el formato [[Palabra|Código]]. No resumas, devuelve todos los versículos.\n\nTEXTO:\n${sourceText}`
        : `Dame el capítulo ${chapter} del libro de ${book} (Versión Reina Valera 1960). Etiqueta las palabras clave con códigos Strong usando el formato [[Palabra|Código]].`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            verses: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  number: { type: Type.INTEGER },
                  text: { type: Type.STRING }
                },
                required: ["number", "text"]
              }
            }
          },
          required: ["verses"]
        }
      }
    });
    
    const textOutput = response.text;
    if (!textOutput) throw new Error("Respuesta vacía de la IA");

    const parsed = JSON.parse(textOutput);
    const resultText = parsed.verses.map((v: any) => `[${v.number}] ${v.text}`).join('\n');
    
    cache[cacheKey] = resultText;
    setCache(BIBLE_CACHE_KEY, cache);
    return { text: resultText, isLocal: isFromLocalFile };
  } catch (error) {
    console.error("Error obteniendo versículos:", error);
    throw new Error("Error de conexión con el servicio de IA.");
  }
};