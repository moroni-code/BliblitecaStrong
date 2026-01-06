import React, { useState, useEffect } from 'react';
import { ViewState, Testament, Book, AppState } from './types';
import { BOOKS } from './constants';
import { TestamentCard, BookCard } from './components/BookCard';
import Reader from './components/Reader';
import { ChevronLeft, Search, Download, X } from 'lucide-react';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    view: 'HOME',
    selectedTestament: null,
    selectedBook: null,
    selectedChapter: null,
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBtn, setShowInstallBtn] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBtn(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', () => setShowInstallBtn(false));
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') setShowInstallBtn(false);
    setDeferredPrompt(null);
  };

  const goHome = () => {
    setState({ view: 'HOME', selectedTestament: null, selectedBook: null, selectedChapter: null });
    setSearchQuery('');
    setIsSearching(false);
  };

  const selectTestament = (t: Testament) => {
    setState(prev => ({ ...prev, view: 'BOOK_LIST', selectedTestament: t }));
  };

  const selectBook = (b: Book) => {
    setState(prev => ({ ...prev, view: 'CHAPTER_GRID', selectedBook: b }));
    setIsSearching(false);
    setSearchQuery('');
  };

  const selectChapter = (c: number) => {
    setState(prev => ({ ...prev, view: 'READER', selectedChapter: c }));
  };

  const handleNextChapter = () => {
    if (!state.selectedBook || !state.selectedChapter) return;
    
    if (state.selectedChapter < state.selectedBook.chapters) {
      setState(prev => ({ ...prev, selectedChapter: (prev.selectedChapter || 0) + 1 }));
    } else {
      const currentIndex = BOOKS.findIndex(b => b.id === state.selectedBook?.id);
      if (currentIndex < BOOKS.length - 1) {
        const nextBook = BOOKS[currentIndex + 1];
        setState(prev => ({ ...prev, selectedBook: nextBook, selectedChapter: 1 }));
      }
    }
  };

  const handlePrevChapter = () => {
    if (!state.selectedBook || !state.selectedChapter) return;

    if (state.selectedChapter > 1) {
      setState(prev => ({ ...prev, selectedChapter: (prev.selectedChapter || 0) - 1 }));
    } else {
      const currentIndex = BOOKS.findIndex(b => b.id === state.selectedBook?.id);
      if (currentIndex > 0) {
        const prevBook = BOOKS[currentIndex - 1];
        setState(prev => ({ ...prev, selectedBook: prevBook, selectedChapter: prevBook.chapters }));
      }
    }
  };

  const renderHome = () => (
    <div className="p-6">
      <div className="flex justify-between items-center mb-12">
        {!isSearching ? (
          <>
            <h1 className="text-3xl font-bold gold-gradient font-serif">Escrituras</h1>
            <div 
              onClick={() => setIsSearching(true)}
              className="bg-[#1a1a1a] p-2 rounded-full cursor-pointer hover:bg-white/5 transition-all"
            >
              <Search className="w-6 h-6 text-gray-400" />
            </div>
          </>
        ) : (
          <div className="flex items-center gap-3 w-full bg-[#1a1a1a] rounded-2xl px-4 py-2 animate-in fade-in zoom-in duration-300">
            <Search className="w-5 h-5 text-gray-500" />
            <input 
              autoFocus
              type="text"
              placeholder="Buscar libro..."
              className="bg-transparent border-none outline-none text-white w-full text-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button onClick={() => { setIsSearching(false); setSearchQuery(''); }}>
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        )}
      </div>
      
      {isSearching && searchQuery ? (
        <div className="grid grid-cols-3 gap-3 animate-in slide-in-from-bottom-4 duration-500">
          {BOOKS.filter(b => b.name.toLowerCase().includes(searchQuery.toLowerCase())).map(book => (
            <BookCard key={book.id} book={book} onClick={() => selectBook(book)} />
          ))}
          {BOOKS.filter(b => b.name.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 && (
            <div className="col-span-3 text-center py-10 opacity-40">No se hallaron resultados</div>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-6 mb-10">
            <TestamentCard title="Antiguo Testamento" onClick={() => selectTestament(Testament.OLD)} />
            <TestamentCard title="Nuevo Testamento" onClick={() => selectTestament(Testament.NEW)} />
          </div>

          <div className="space-y-4">
            {showInstallBtn && (
              <button 
                onClick={handleInstallClick}
                className="w-full bg-gradient-to-r from-[#d4af37] to-[#b8860b] p-5 rounded-2xl flex items-center justify-center gap-3 shadow-xl active:scale-95 transition-all"
              >
                <Download className="w-6 h-6 text-black" />
                <span className="text-black font-bold text-lg">Instalar App</span>
              </button>
            )}
          </div>
        </>
      )}

      <div className="mt-16 opacity-30">
        <p className="text-[10px] text-center text-gray-600 uppercase tracking-[0.3em] font-bold">Estudio Bíblico Avanzado</p>
      </div>
    </div>
  );

  const renderBookList = () => {
    const filteredBooks = BOOKS.filter(b => b.testament === state.selectedTestament);
    return (
      <div className="p-4 flex flex-col h-full bg-black">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={goHome} className="p-2 hover:bg-white/5 rounded-full"><ChevronLeft className="w-6 h-6 text-white" /></button>
          <div>
            <h1 className="text-xl font-bold text-white">{state.selectedTestament}</h1>
            <p className="text-xs text-gray-500 uppercase tracking-widest">Libros</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 overflow-y-auto pb-10 no-scrollbar">
          {filteredBooks.map(book => (
            <BookCard key={book.id} book={book} onClick={() => selectBook(book)} />
          ))}
        </div>
      </div>
    );
  };

  const renderChapterGrid = () => (
    <div className="p-4 flex flex-col h-full bg-black">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => setState(prev => ({ ...prev, view: 'BOOK_LIST' }))} className="p-2 hover:bg-white/5 rounded-full">
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-white">{state.selectedBook?.name}</h1>
          <p className="text-xs text-gray-500 uppercase tracking-widest">Capítulos</p>
        </div>
      </div>
      <div className="grid grid-cols-5 gap-3 overflow-y-auto pb-10 no-scrollbar">
        {Array.from({ length: state.selectedBook?.chapters || 0 }).map((_, i) => (
          <button
            key={i}
            onClick={() => selectChapter(i + 1)}
            className="aspect-square bg-[#1a1a1a] rounded-xl flex items-center justify-center text-lg font-medium text-gray-200 hover:bg-white/10 active:scale-95 transition-all border border-white/5"
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );

  const renderView = () => {
    switch (state.view) {
      case 'HOME': return renderHome();
      case 'BOOK_LIST': return renderBookList();
      case 'CHAPTER_GRID': return renderChapterGrid();
      case 'READER': 
        return (
          <Reader 
            book={state.selectedBook!} 
            chapter={state.selectedChapter!} 
            onBack={() => setState(prev => ({ ...prev, view: 'CHAPTER_GRID' }))} 
            onNext={handleNextChapter}
            onPrev={handlePrevChapter}
          />
        );
      default: return renderHome();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-black overflow-hidden selection:bg-[#d4af37]/30">
      <div className="flex-1 overflow-hidden">
        {renderView()}
      </div>
    </div>
  );
};

export default App;