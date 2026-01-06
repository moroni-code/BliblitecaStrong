
import React from 'react';
import { Book, Testament } from '../types';

interface BookCardProps {
  book: Book;
  onClick: () => void;
}

export const TestamentCard: React.FC<{ title: string; onClick: () => void }> = ({ title, onClick }) => (
  <div 
    onClick={onClick}
    className="aspect-[3/4] rounded-2xl p-6 flex flex-col items-center justify-start cursor-pointer transition-all active:scale-95 group relative overflow-hidden"
    style={{ background: 'linear-gradient(180deg, #1a1a1a 0%, #0a0a0a 100%)' }}
  >
    <div className="absolute top-0 left-0 w-full h-1 bg-white/5 group-hover:bg-blue-500/30 transition-colors" />
    <div className="border-t border-b border-[#d4af37]/30 py-4 px-2 mb-4 w-full text-center">
      <h3 className="text-[#d4af37] text-xl font-bold uppercase tracking-widest leading-tight">
        {title.split(' ')[0]}<br/>{title.split(' ')[1]}
      </h3>
    </div>
    <div className="mt-auto text-gray-500 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
      Explorar libros
    </div>
  </div>
);

export const BookCard: React.FC<BookCardProps> = ({ book, onClick }) => (
  <div 
    onClick={onClick}
    className="bg-[#1a1a1a] rounded-xl p-4 flex flex-col gap-2 cursor-pointer border border-white/5 active:bg-white/5 transition-colors group"
  >
    <div className="w-full aspect-square bg-[#121212] rounded-lg mb-2 flex items-center justify-center group-hover:scale-105 transition-transform">
      <span className="text-gray-700 text-2xl font-serif">{book.name[0]}</span>
    </div>
    <span className="text-gray-200 text-sm font-medium truncate">{book.name}</span>
  </div>
);
