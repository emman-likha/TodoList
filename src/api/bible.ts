import type { BibleVerse } from '../hooks/useBibleVerses';

// Type definition for the Electron API exposed via preload
declare global {
  interface Window {
    electronAPI: {
      bible: {
        getRandom: (category?: string) => Promise<BibleVerse | null>;
        getByCategory: (category: string) => Promise<BibleVerse[]>;
        getByReference: (reference: { book: string; chapter: number; verse: number }) => Promise<BibleVerse | null>;
        getAll: () => Promise<BibleVerse[]>;
        add: (verse: Omit<BibleVerse, 'id' | 'createdAt'>) => Promise<BibleVerse>;
      };
    };
  }
}

/**
 * Check if we're running in Electron
 */
export const isElectron = () => {
  return typeof window !== 'undefined' && window.electronAPI !== undefined;
};

/**
 * Bible Verses API
 */
export const bibleAPI = {
  async getRandom(category?: BibleVerse['category']): Promise<BibleVerse | null> {
    if (isElectron()) {
      return window.electronAPI.bible.getRandom(category);
    }
    
    // Fallback: return a default verse if not in Electron
    return {
      id: 1,
      book: 'Philippians',
      chapter: 4,
      verse: 13,
      verseText: 'I can do all this through him who gives me strength.',
      category: 'strength',
      createdAt: new Date(),
    };
  },

  async getByCategory(category: BibleVerse['category']): Promise<BibleVerse[]> {
    if (isElectron()) {
      return window.electronAPI.bible.getByCategory(category);
    }
    return [];
  },

  async getByReference(reference: { book: string; chapter: number; verse: number }): Promise<BibleVerse | null> {
    if (isElectron()) {
      return window.electronAPI.bible.getByReference(reference);
    }
    return null;
  },

  async getAll(): Promise<BibleVerse[]> {
    if (isElectron()) {
      return window.electronAPI.bible.getAll();
    }
    return [];
  },

  async add(verse: Omit<BibleVerse, 'id' | 'createdAt'>): Promise<BibleVerse> {
    if (isElectron()) {
      return window.electronAPI.bible.add(verse);
    }
    throw new Error('Bible API only available in Electron');
  },
};

