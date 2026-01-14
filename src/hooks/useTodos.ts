import { useState, useEffect } from 'react';
import { todoAPI } from '../api/database';

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: Date;
}

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load todos from database on mount
  useEffect(() => {
    const loadTodos = async () => {
      try {
        setLoading(true);
        const loadedTodos = await todoAPI.getAll();
        setTodos(loadedTodos);
        setError(null);
      } catch (err) {
        console.error('Error loading todos:', err);
        setError('Failed to load todos');
      } finally {
        setLoading(false);
      }
    };

    loadTodos();
  }, []);

  const addTodo = async (text: string, priority: 'low' | 'medium' | 'high') => {
    try {
      const newTodo: Omit<Todo, 'createdAt'> = {
        id: Date.now().toString(),
        text,
        completed: false,
        priority,
      };
      const created = await todoAPI.create(newTodo);
      setTodos(prev => [created, ...prev]);
      setError(null);
    } catch (err) {
      console.error('Error adding todo:', err);
      setError('Failed to add todo');
    }
  };

  const toggleTodo = async (id: string) => {
    try {
      const todo = todos.find(t => t.id === id);
      if (!todo) return;

      const updated = await todoAPI.update(id, { completed: !todo.completed });
      if (updated) {
        setTodos(prev =>
          prev.map(t => t.id === id ? updated : t)
        );
        setError(null);
      }
    } catch (err) {
      console.error('Error toggling todo:', err);
      setError('Failed to update todo');
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      const success = await todoAPI.delete(id);
      if (success) {
        setTodos(prev => prev.filter(todo => todo.id !== id));
        setError(null);
      }
    } catch (err) {
      console.error('Error deleting todo:', err);
      setError('Failed to delete todo');
    }
  };

  const editTodo = async (id: string, newText: string) => {
    try {
      const updated = await todoAPI.update(id, { text: newText });
      if (updated) {
        setTodos(prev =>
          prev.map(todo => todo.id === id ? updated : todo)
        );
        setError(null);
      }
    } catch (err) {
      console.error('Error editing todo:', err);
      setError('Failed to edit todo');
    }
  };

  const changePriority = async (id: string, priority: 'low' | 'medium' | 'high') => {
    try {
      const updated = await todoAPI.update(id, { priority });
      if (updated) {
        setTodos(prev =>
          prev.map(todo => todo.id === id ? updated : todo)
        );
        setError(null);
      }
    } catch (err) {
      console.error('Error changing priority:', err);
      setError('Failed to change priority');
    }
  };

  const clearCompleted = async () => {
    try {
      await todoAPI.clearCompleted();
      setTodos(prev => prev.filter(todo => !todo.completed));
      setError(null);
    } catch (err) {
      console.error('Error clearing completed todos:', err);
      setError('Failed to clear completed todos');
    }
  };

  return {
    todos,
    loading,
    error,
    addTodo,
    toggleTodo,
    deleteTodo,
    editTodo,
    changePriority,
    clearCompleted,
  };
};
