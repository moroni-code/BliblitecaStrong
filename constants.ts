
import { Book, Testament } from './types';

export const BOOKS: Book[] = [
  // Old Testament
  { id: 'gen', name: 'Génesis', testament: Testament.OLD, chapters: 50 },
  { id: 'exo', name: 'Éxodo', testament: Testament.OLD, chapters: 40 },
  { id: 'lev', name: 'Levítico', testament: Testament.OLD, chapters: 27 },
  { id: 'num', name: 'Números', testament: Testament.OLD, chapters: 36 },
  { id: 'deu', name: 'Deuteronomio', testament: Testament.OLD, chapters: 34 },
  { id: 'jos', name: 'Josué', testament: Testament.OLD, chapters: 24 },
  { id: 'jud', name: 'Jueces', testament: Testament.OLD, chapters: 21 },
  { id: 'rut', name: 'Rut', testament: Testament.OLD, chapters: 4 },
  { id: '1sa', name: '1 Samuel', testament: Testament.OLD, chapters: 31 },
  { id: '2sa', name: '2 Samuel', testament: Testament.OLD, chapters: 24 },
  
  // New Testament
  { id: 'mat', name: 'Mateo', testament: Testament.NEW, chapters: 28 },
  { id: 'mar', name: 'Marcos', testament: Testament.NEW, chapters: 16 },
  { id: 'luc', name: 'Lucas', testament: Testament.NEW, chapters: 24 },
  { id: 'jua', name: 'Juan', testament: Testament.NEW, chapters: 21 },
  { id: 'hch', name: 'Hechos', testament: Testament.NEW, chapters: 28 },
  { id: 'rom', name: 'Romanos', testament: Testament.NEW, chapters: 16 },
  { id: '1co', name: '1 Corintios', testament: Testament.NEW, chapters: 16 },
  { id: '2co', name: '2 Corintios', testament: Testament.NEW, chapters: 13 },
  { id: 'gal', name: 'Gálatas', testament: Testament.NEW, chapters: 6 },
  { id: 'efe', name: 'Efesios', testament: Testament.NEW, chapters: 6 },
  { id: 'fil', name: 'Filipenses', testament: Testament.NEW, chapters: 4 },
  { id: 'col', name: 'Colosenses', testament: Testament.NEW, chapters: 4 },
  { id: 'apo', name: 'Apocalipsis', testament: Testament.NEW, chapters: 22 },
];
