
import React, { useState, useEffect, useRef } from 'react';
import { getBibleVerses, getStrongDefinition } from '../geminiService';
import { StrongInfo, Book } from '../types';
import { Loader2, X, ChevronLeft, MoreVertical, WifiOff, Globe, BookOpen, ScrollText, CheckCircle2 } from 'lucide-react';

interface ReaderProps {
  book: Book;
  chapter: number;
  onBack: () => void;
  onNext: () => void;
  onPrev: () => void;
}

const StrongSidePanel: React.FC<{ info: StrongInfo; word: string; isOpen: boolean; onClose: () => void }> = ({ info, word, isOpen, onClose }) => {
  return (
    <>
      <div className={`backdrop ${isOpen ? 'open' : ''}`} onClick={onClose} />
      <div className={`side-panel ${isOpen ? 'open' : ''}`}>
        <div className="pt-16 pb-6 px-10 border-b border-white/5 flex items-center justify-between bg-[#121212]">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
              <BookOpen className="w-6 h-6 text-blue-500" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em]">Estudio Filológico</span>
              <span className="text-[11px] font-bold text-blue-400 uppercase">RVR1960 Interlineal</span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors group">
            <X className="w-7 h-7 text-gray-500 group-hover:text-white" />
          </button>
        </div>

        <div className="panel-content no-scrollbar space-y-12">
          <header className="space-y-6">
            <div className="space-y-2">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Léxico Español</p>
              <h2 className="text-5xl font-bold text-white tracking-tight leading-tight">{word}</h2>
            </div>
            
            <div className="flex items-end justify-between border-b border-white/10 pb-8">
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Original</p>
                <span className="text-[#d4af37] font-serif text-7xl leading-none">{info.original}</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="px-4 py-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[12px] font-black rounded-full uppercase tracking-tighter shadow-xl">
                  Strong {info.code}
                </span>
              </div>
            </div>
          </header>

          <section className="space-y-10">
            <div className="bg-white/5 p-8 rounded-[2rem] border border-white/5 flex flex-col gap-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2 mb-2">
                  <Globe className="w-4 h-4 text-blue-400" />
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.3em]">Transliteración Académica</label>
                </div>
                <p className="text-3xl text-white font-medium italic font-serif">{info.transliteration}</p>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-4 h-4 rounded-full border-2 border-blue-500/30" />
                  <label className="text-[11px] font-bold text-gray-400 uppercase tracking-[0.3em]">Pronunciación Hispana</label>
                </div>
                <p className="text-2xl text-blue-300 font-bold">{info.pronunciation}</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <ScrollText className="w-5 h-5 text-[#d4af37]" />
                <label className="text-[12px] font-black text-[#d4af37] uppercase tracking-[0.3em]">Significado Exhaustivo</label>
              </div>
              <div className="bg-[#1a1a1a] p-10 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500/40" />
                <p className="text-gray-200 text-xl leading-relaxed font-medium whitespace-pre-wrap">
                  {info.definition}
                </p>
              </div>
            </div>
          </section>
        </div>
        
        <div className="p-10 bg-[#121212] border-t border-white/5">
          <button 
            onClick={onClose} 
            className="w-full py-5 bg-white text-black rounded-2xl font-black text-[11px] uppercase tracking-[0.35em] active:scale-[0.97] transition-all hover:bg-gray-100 shadow-[0_15px_30px_rgba(255,255,255,0.05)]"
          >
            Regresar a la Biblia
          </button>
        </div>
      </div>
    </>
  );
};

const Reader: React.FC<ReaderProps> = ({ book, chapter, onBack, onNext, onPrev }) => {
  const [content, setContent] = useState<string>('');
  const [isLocal, setIsLocal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [panelData, setPanelData] = useState<{info: StrongInfo, word: string} | null>(null);
  const [fetchingStrong, setFetchingStrong] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      setError(null);
      try {
        const result = await getBibleVerses(book.name, chapter);
        setContent(result.text);
        setIsLocal(result.isLocal);
        if (scrollRef.current) scrollRef.current.scrollTo(0, 0);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, [book, chapter]);

  const handleWordClick = async (word: string) => {
    if (fetchingStrong) return;
    setFetchingStrong(true);
    try {
      const info = await getStrongDefinition(word, book.testament);
      setPanelData({ info, word });
    } catch (err) {
      alert("Error en el mapeo interlineal.");
    } finally {
      setFetchingStrong(false);
    }
  };

  const parseVerse = (line: string, index: number) => {
    const verseNumMatch = line.match(/^\[(\d+)\]/);
    if (!verseNumMatch && line.length < 5) return null;

    const verseNumber = verseNumMatch ? verseNumMatch[1] : null;
    const remainingText = verseNumber ? line.substring(line.indexOf(']') + 1).trim() : line;
    
    const formattedText = remainingText.split('/n').map((subpart, si) => (
      <React.Fragment key={si}>
        {si > 0 && <br />}
        {subpart.split(/(\[\[.*?\]\])/g).filter(p => p !== undefined && p !== "").map((part, i) => {
          if (part.startsWith('[[') && part.endsWith(']]')) {
            const inner = part.slice(2, -2);
            const [word] = inner.split('|'); 
            const isActive = panelData?.word === word;
            return (
              <span 
                key={i} 
                className={`strong-word ${isActive ? 'active' : ''}`}
                onClick={() => handleWordClick(word)}
              >
                {word}
              </span>
            );
          }
          return <span key={i}>{part}</span>;
        })}
      </React.Fragment>
    ));
    
    return (
      <div key={index} className="verse-item">
        <div className="bible-text">
          {verseNumber && (
            <span className="verse-number">
              {verseNumber}
            </span>
          )}
          {formattedText}
        </div>
      </div>
    );
  };

  const lines = content.split('\n').filter(line => line.trim().length > 0);

  return (
    <div 
      className="h-screen bg-black flex flex-col relative"
      onTouchStart={(e) => { touchStartX.current = e.targetTouches[0].clientX; }}
      onTouchEnd={(e) => {
        if (!touchStartX.current) return;
        const diff = touchStartX.current - e.changedTouches[0].clientX;
        if (Math.abs(diff) > 100) diff > 0 ? onNext() : onPrev();
        touchStartX.current = null;
      }}
    >
      <div className="sticky top-0 z-40 bg-black/95 backdrop-blur-2xl pt-14 pb-5 px-6 flex items-center justify-between border-b border-white/5">
        <button onClick={onBack} className="p-2 -ml-2 hover:bg-white/5 rounded-full transition-colors">
          <ChevronLeft className="w-8 h-8 text-white" />
        </button>
        <div className="text-center">
          <h1 className="text-xl font-bold text-white tracking-tight">{book.name} {chapter}</h1>
          <div className="flex items-center justify-center gap-2 mt-1">
            <div className={`w-1.5 h-1.5 rounded-full ${isLocal ? 'bg-green-500' : 'bg-blue-500'} animate-pulse`} />
            <p className={`text-[9px] ${isLocal ? 'text-green-500' : 'text-blue-500'} uppercase font-black tracking-[0.4em]`}>
              {isLocal ? 'RVR1960 VERBATIM' : 'RVR1960 INTERLINEAL'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
           <MoreVertical className="w-6 h-6 text-gray-800" />
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto no-scrollbar px-10 py-12">
        <div className="max-w-3xl mx-auto w-full">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-72 gap-12">
              <div className="relative">
                <Loader2 className="w-16 h-16 animate-spin text-blue-500" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full animate-ping" />
                </div>
              </div>
              <div className="text-center space-y-4">
                <p className="text-white font-black uppercase text-[12px] tracking-[0.6em]">Procesando Escrituras</p>
                <p className="text-gray-600 text-[10px] uppercase tracking-[0.4em]">Inyectando Strong...</p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-48">
              <WifiOff className="w-16 h-16 text-gray-800 mx-auto mb-8" />
              <button onClick={() => window.location.reload()} className="px-14 py-4 border border-blue-500/20 text-blue-500 rounded-full text-[11px] font-black uppercase tracking-[0.3em]">Reintentar</button>
            </div>
          ) : (
            <div className="pb-64">
              {isLocal && (
                <div className="mb-10 flex items-center gap-3 px-4 py-2 bg-green-500/5 border border-green-500/10 rounded-xl w-fit">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span className="text-[10px] text-green-500 font-bold uppercase tracking-widest">Fuente Verificada: Texto Local</span>
                </div>
              )}
              {lines.map((line, idx) => parseVerse(line, idx))}
            </div>
          )}
        </div>
      </div>

      {fetchingStrong && (
        <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[1001]">
          <div className="bg-[#121212] px-10 py-5 rounded-2xl flex items-center gap-6 shadow-2xl border border-white/10 backdrop-blur-xl">
            <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
            <span className="text-[11px] font-black text-white uppercase tracking-[0.3em]">Extrayendo Etimología...</span>
          </div>
        </div>
      )}
      
      {panelData && (
        <StrongSidePanel 
          info={panelData.info} 
          word={panelData.word} 
          isOpen={!!panelData}
          onClose={() => setPanelData(null)} 
        />
      )}
    </div>
  );
};

export default Reader;
