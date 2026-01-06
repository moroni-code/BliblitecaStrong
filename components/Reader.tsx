
import React, { useState, useEffect } from 'react';
import { getBibleVerses, getStrongDefinition } from '../geminiService';
import { StrongInfo, Book } from '../types';
import { Loader2, X, ChevronLeft, Bookmark, MoreVertical, WifiOff, CloudDownload } from 'lucide-react';

interface ReaderProps {
  book: Book;
  chapter: number;
  onBack: () => void;
}

const StrongModal: React.FC<{ info: StrongInfo; spanishWord: string; onClose: () => void }> = ({ info, spanishWord, onClose }) => (
  <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4" onClick={onClose}>
    <div className="bg-[#1a1a1a] w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 border-t border-gray-800 shadow-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
      <div className="flex justify-between items-start mb-6 sticky top-0 bg-[#1a1a1a] pb-4 z-10 border-b border-white/5">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-white font-bold text-2xl capitalize">{spanishWord}</h3>
            <span className="text-gray-400 font-serif text-2xl">({info.original})</span>
          </div>
          <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-1">Diccionario Strong: {info.code}</p>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
          <X className="w-6 h-6 text-gray-400" />
        </button>
      </div>
      
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Transliteración</label>
            <p className="text-gray-300 font-medium">{info.transliteration}</p>
          </div>
          <div>
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Pronunciación</label>
            <p className="text-gray-300 italic">{info.pronunciation}</p>
          </div>
        </div>
        
        <div className="pt-2">
          <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-2">Definición Detallada</label>
          <div className="text-gray-200 leading-relaxed text-base whitespace-pre-wrap">
            {info.definition}
          </div>
        </div>
      </div>

      <button onClick={onClose} className="w-full mt-8 py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-bold border border-white/10 transition-all">
        Cerrar
      </button>
    </div>
  </div>
);

const Reader: React.FC<ReaderProps> = ({ book, chapter, onBack }) => {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStrong, setSelectedStrong] = useState<{info: StrongInfo, word: string} | null>(null);
  const [fetchingStrong, setFetchingStrong] = useState(false);

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      setError(null);
      try {
        const text = await getBibleVerses(book.name, chapter);
        setContent(text);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, [book, chapter]);

  const handleWordClick = async (word: string) => {
    setFetchingStrong(true);
    try {
      const info = await getStrongDefinition(word, book.testament);
      setSelectedStrong({ info, word });
    } catch (err) {
      alert("Esta palabra requiere internet para ser analizada por primera vez.");
    } finally {
      setFetchingStrong(false);
    }
  };

  const parseVerse = (line: string) => {
    const parts = line.split(/(\[\[.*?\]\]|^(\d+)\s+)/g).filter(p => p !== undefined && p !== "");
    return parts.map((part, i) => {
      if (part.startsWith('[[') && part.endsWith(']]')) {
        const word = part.slice(2, -2);
        return (
          <span 
            key={i} 
            className="text-white cursor-pointer border-b border-white/10 hover:border-white transition-colors mx-0.5"
            onClick={() => handleWordClick(word)}
          >
            {word}
          </span>
        );
      } else if (/^\d+$/.test(part)) {
        return <span key={i} className="text-white/30 font-bold mr-3 text-sm">{part}</span>;
      }
      return <span key={i} className="text-gray-300">{part}</span>;
    });
  };

  const verses = content.split('\n').filter(line => line.trim().length > 0);

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <div className="sticky top-0 z-40 bg-black/90 backdrop-blur-md border-b border-white/5 p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-1">
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-white leading-none">{book.name} {chapter}</h1>
            <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] mt-1 font-bold">RVR1960 • {book.testament}</p>
          </div>
        </div>
        <div className="flex items-center gap-5 text-gray-400">
           <CloudDownload className="w-5 h-5 opacity-30" />
           <MoreVertical className="w-5 h-5 cursor-pointer hover:text-white" />
        </div>
      </div>

      <div className="flex-1 p-6 md:p-12 max-w-2xl mx-auto w-full">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-6">
            <Loader2 className="w-10 h-10 animate-spin text-white/20" />
            <p className="text-gray-600 font-medium tracking-wide">Accediendo a las escrituras...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-32 text-center gap-6">
            <WifiOff className="w-16 h-16 text-gray-800" />
            <div>
              <h2 className="text-xl font-bold text-white mb-2">Sin Conexión</h2>
              <p className="text-gray-500 max-w-xs">{error}</p>
            </div>
            <button onClick={() => window.location.reload()} className="px-8 py-3 bg-white/5 rounded-full border border-white/10 text-sm font-bold">
              Reintentar
            </button>
          </div>
        ) : (
          <div className="bible-text space-y-4 pb-20">
            {verses.map((verse, idx) => (
              <div key={idx} className="flex items-start">
                <div className="text-lg leading-[1.8]">
                  {parseVerse(verse)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {fetchingStrong && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-[2px] z-[60] flex items-center justify-center">
          <div className="bg-[#1a1a1a] p-5 rounded-3xl flex items-center gap-4 shadow-2xl border border-white/10">
            <Loader2 className="w-5 h-5 animate-spin text-white/50" />
            <span className="text-sm font-bold text-white tracking-tight">Diccionario...</span>
          </div>
        </div>
      )}
      
      {selectedStrong && (
        <StrongModal 
          info={selectedStrong.info} 
          spanishWord={selectedStrong.word} 
          onClose={() => setSelectedStrong(null)} 
        />
      )}
    </div>
  );
};

export default Reader;
