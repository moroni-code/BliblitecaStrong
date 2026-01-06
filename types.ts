
export enum Testament {
  OLD = 'Antiguo Testamento',
  NEW = 'Nuevo Testamento'
}

export interface Book {
  id: string;
  name: string;
  testament: Testament;
  chapters: number;
}

export interface StrongInfo {
  code: string;
  original: string;
  transliteration: string;
  pronunciation: string;
  definition: string;
}

export type ViewState = 'HOME' | 'BOOK_LIST' | 'CHAPTER_GRID' | 'READER';

export interface AppState {
  view: ViewState;
  selectedTestament: Testament | null;
  selectedBook: Book | null;
  selectedChapter: number | null;
}
