import React from 'react';
import { Book, Testament } from '../types';

interface BookCardProps {
  book: Book;
  onClick: () => void;
}

export const TestamentCard: React.FC<{ title: string; onClick: () => void }> = ({ title, onClick }) => (
  <div 
    onClick={onClick}
    className="aspect-[3/4] rounded-3xl p-6 flex flex-col items-center justify-start pt-8 cursor-pointer transition-all active:scale-95 group relative overflow-hidden border border-white/5 shadow-2xl"
    style={{ background: 'linear-gradient(180deg, #1a1a1a 0%, #0a0a0a 100%)' }}
  >
    {/* Barra decorativa superior */}
    <div className="absolute top-0 left-0 w-full h-1 bg-[#d4af37]/30 group-hover:h-1.5 group-hover:bg-[#d4af37]/60 transition-all" />
    
    {/* Contenedor de texto centrado horizontalmente pero en la parte superior */}
    <div className="border-y border-[#d4af37]/20 py-6 px-2 w-full text-center flex flex-col items-center justify-center gap-1">
      <h3 className="text-[#d4af37] text-lg font-black uppercase tracking-[0.2em] leading-tight">
        {title.split(' ')[0]}
      </h3>
      <h3 className="text-[#d4af37] text-lg font-black uppercase tracking-[0.2em] leading-tight opacity-70">
        {title.split(' ')[1]}
      </h3>
    </div>

    {/* Indicador inferior sutil */}
    <div className="absolute bottom-8 text-[#d4af37]/30 text-[8px] font-black uppercase tracking-[0.4em] opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
      Abrir Canon
    </div>
  </div>
);

export const BookCard: React.FC<BookCardProps> = ({ book, onClick }) => (
  <div 
    onClick={onClick}
    className="bg-[#1a1a1a] rounded-2xl p-4 flex flex-col gap-3 cursor-pointer border border-white/5 active:bg-white/10 transition-all hover:border-[#d4af37]/30 group"
  >
    <div className="w-full aspect-square bg-gradient-to-br from-[#121212] to-[#0a0a0a] rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform border border-white/5">
      <span className="text-[#d4af37]/40 text-3xl font-serif italic select-none">{book.name[0]}</span>
    </div>
    <span className="text-gray-300 text-[10px] font-bold truncate text-center uppercase tracking-wider">{book.name}</span>
  </div>
);