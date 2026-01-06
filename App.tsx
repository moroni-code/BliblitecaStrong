
import React, { useState, useEffect } from 'react';
import { ViewState, Testament, Book, AppState } from './types';
import { BOOKS } from './constants';
import { TestamentCard, BookCard } from './components/BookCard';
import Reader from './components/Reader';
import { ChevronLeft, Search, Download } from 'lucide-react';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    view: 'HOME',
    selectedTestament: null,
    selectedBook: null,
    selectedChapter: null,
  });

  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBtn, setShowInstallBtn] = useState(false);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBtn(true);
    };
    window.addEventListener('beforeinstallprompt', handler);

    // Si ya está instalada la app
    window.addEventListener('appinstalled', () => {
      setShowInstallBtn(false);
    });

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowInstallBtn(false);
    }
    setDeferredPrompt(null);
  };

  const goHome = () => setState({ view: 'HOME', selectedTestament: null, selectedBook: null, selectedChapter: null });

  const selectTestament = (t: Testament) => {
    setState(prev => ({ ...prev, view: 'BOOK_LIST', selectedTestament: t }));
  };

  const selectBook = (b: Book) => {
    setState(prev => ({ ...prev, view: 'CHAPTER_GRID', selectedBook: b }));
  };

  const selectChapter = (c: number) => {
    setState(prev => ({ ...prev, view: 'READER', selectedChapter: c }));
  };

  const renderHome = () => (
    <div className="p-6">
      <div className="flex justify-between items-center mb-12">
        <h1 className="text-3xl font-bold gold-gradient font-serif">Escrituras</h1>
        <div className="bg-[#1a1a1a] p-2 rounded-full cursor-pointer hover:bg-white/5">
          <Search className="w-6 h-6 text-gray-400" />
        </div>
      </div>
      
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
            <span className="text-black font-bold text-lg">Instalar App en el Celular</span>
          </button>
        )}
      </div>

      <div className="mt-16 opacity-30">
        <p className="text-[10px] text-center text-gray-600 uppercase tracking-[0.3em] font-bold">Estudio Bíblico Avanzado • Código Strong</p>
      </div>
    </div>
  );

  const renderBookList = () => {
    const filteredBooks = BOOKS.filter(b => b.testament === state.selectedTestament);
    return (
      <div className="p-4 flex flex-col h-full">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={goHome} className="p-2 hover:bg-white/5 rounded-full"><ChevronLeft className="w-6 h-6" /></button>
          <div>
            <h1 className="text-xl font-bold">{state.selectedTestament}</h1>
            <p className="text-xs text-gray-500 uppercase tracking-widest">Biblioteca</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 overflow-y-auto pb-10">
          {filteredBooks.map(book => (
            <BookCard key={book.id} book={book} onClick={() => selectBook(book)} />
          ))}
        </div>
      </div>
    );
  };

  const renderChapterGrid = () => (
    <div className="p-4 flex flex-col h-full">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => setState(prev => ({ ...prev, view: 'BOOK_LIST' }))} className="p-2 hover:bg-white/5 rounded-full">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-xl font-bold">{state.selectedBook?.name}</h1>
          <p className="text-xs text-gray-500 uppercase tracking-widest">Seleccionar Capítulo</p>
        </div>
      </div>
      <div className="grid grid-cols-5 gap-3 overflow-y-auto pb-10">
        {Array.from({ length: state.selectedBook?.chapters || 0 }).map((_, i) => (
          <button
            key={i}
            onClick={() => selectChapter(i + 1)}
            className="aspect-square bg-[#1a1a1a] rounded-xl flex items-center justify-center text-lg font-medium hover:bg-white/10 active:scale-95 transition-all border border-white/5"
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
          />
        );
      default: return renderHome();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-black overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        {renderView()}
      </div>
    </div>
  );
};

export default App;
