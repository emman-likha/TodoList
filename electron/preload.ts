import { contextBridge, ipcRenderer } from 'electron';
import { Todo } from '../src/hooks/useTodos';

export interface BibleVerse {
  id: number;
  book: string;
  chapter: number;
  verse: number;
  verseText: string;
  category: 'motivation' | 'encouragement' | 'strength' | 'peace' | 'hope' | 'perseverance';
  createdAt: Date;
}

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Database operations
  todos: {
    getAll: (): Promise<Todo[]> => ipcRenderer.invoke('todos:getAll'),
    create: (todo: Omit<Todo, 'createdAt'>): Promise<Todo> => ipcRenderer.invoke('todos:create', todo),
    update: (id: string, updates: Partial<Pick<Todo, 'text' | 'completed' | 'priority'>>): Promise<Todo | null> => 
      ipcRenderer.invoke('todos:update', id, updates),
    delete: (id: string): Promise<boolean> => ipcRenderer.invoke('todos:delete', id),
    clearCompleted: (): Promise<number> => ipcRenderer.invoke('todos:clearCompleted'),
  },
  // Bible verses operations
  bible: {
    getRandom: (category?: string): Promise<BibleVerse | null> => ipcRenderer.invoke('bible:getRandom', category),
    getByCategory: (category: string): Promise<BibleVerse[]> => ipcRenderer.invoke('bible:getByCategory', category),
    getByReference: (reference: { book: string; chapter: number; verse: number }): Promise<BibleVerse | null> => 
      ipcRenderer.invoke('bible:getByReference', reference),
    getAll: (): Promise<BibleVerse[]> => ipcRenderer.invoke('bible:getAll'),
    add: (verse: Omit<BibleVerse, 'id' | 'createdAt'>): Promise<BibleVerse> => ipcRenderer.invoke('bible:add', verse),
  },
});

