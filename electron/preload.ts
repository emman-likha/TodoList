import { contextBridge, ipcRenderer } from 'electron';
import { Todo } from '../src/hooks/useTodos';

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
});

