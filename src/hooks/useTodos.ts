import { useState, useEffect } from 'react';
import { todoAPI } from '../api/database';

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  deadline: Date | null;
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
        setError(null);
        const loadedTodos = await todoAPI.getAll();
        console.log('Loaded todos:', loadedTodos);
        setTodos(loadedTodos || []);
      } catch (err) {
        console.error('Error loading todos:', err);
        setError('Failed to load todos');
        setTodos([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    };

    loadTodos();
  }, []);

  const addTodo = async (text: string, deadline: Date | null) => {
    try {
      const newTodo: Omit<Todo, 'createdAt'> = {
        id: Date.now().toString(),
        text,
        completed: false,
        deadline,
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

  const updateDeadline = async (id: string, deadline: Date | null) => {
    try {
      const updated = await todoAPI.update(id, { deadline });
      if (updated) {
        setTodos(prev =>
          prev.map(todo => todo.id === id ? updated : todo)
        );
        setError(null);
      }
    } catch (err) {
      console.error('Error updating deadline:', err);
      setError('Failed to update deadline');
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
    updateDeadline,
    clearCompleted,
  };
};
