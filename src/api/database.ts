import { Todo } from '../hooks/useTodos';

// Type definition for the Electron API exposed via preload
declare global {
  interface Window {
    electronAPI: {
      todos: {
        getAll: () => Promise<Todo[]>;
        create: (todo: Omit<Todo, 'createdAt'>) => Promise<Todo>;
        update: (id: string, updates: Partial<Pick<Todo, 'text' | 'completed' | 'priority'>>) => Promise<Todo | null>;
        delete: (id: string) => Promise<boolean>;
        clearCompleted: () => Promise<number>;
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
 * Database API for todos
 * Falls back to localStorage if not in Electron
 */
export const todoAPI = {
  async getAll(): Promise<Todo[]> {
    if (isElectron()) {
      return window.electronAPI.todos.getAll();
    }
    
    // Fallback to localStorage
    const savedTodos = localStorage.getItem('scribble-todos');
    if (savedTodos) {
      try {
        return JSON.parse(savedTodos).map((todo: any) => ({
          ...todo,
          createdAt: new Date(todo.createdAt),
        }));
      } catch (error) {
        console.error('Error loading todos from localStorage:', error);
        return [];
      }
    }
    return [];
  },

  async create(todo: Omit<Todo, 'createdAt'>): Promise<Todo> {
    if (isElectron()) {
      return window.electronAPI.todos.create(todo);
    }
    
    // Fallback to localStorage
    const newTodo: Todo = {
      ...todo,
      createdAt: new Date(),
    };
    const todos = await this.getAll();
    todos.unshift(newTodo);
    localStorage.setItem('scribble-todos', JSON.stringify(todos));
    return newTodo;
  },

  async update(id: string, updates: Partial<Pick<Todo, 'text' | 'completed' | 'priority'>>): Promise<Todo | null> {
    if (isElectron()) {
      return window.electronAPI.todos.update(id, updates);
    }
    
    // Fallback to localStorage
    const todos = await this.getAll();
    const index = todos.findIndex(t => t.id === id);
    if (index === -1) return null;
    
    todos[index] = { ...todos[index], ...updates };
    localStorage.setItem('scribble-todos', JSON.stringify(todos));
    return todos[index];
  },

  async delete(id: string): Promise<boolean> {
    if (isElectron()) {
      return window.electronAPI.todos.delete(id);
    }
    
    // Fallback to localStorage
    const todos = await this.getAll();
    const filtered = todos.filter(t => t.id !== id);
    localStorage.setItem('scribble-todos', JSON.stringify(filtered));
    return filtered.length < todos.length;
  },

  async clearCompleted(): Promise<number> {
    if (isElectron()) {
      return window.electronAPI.todos.clearCompleted();
    }
    
    // Fallback to localStorage
    const todos = await this.getAll();
    const completed = todos.filter(t => t.completed);
    const active = todos.filter(t => !t.completed);
    localStorage.setItem('scribble-todos', JSON.stringify(active));
    return completed.length;
  },
};

