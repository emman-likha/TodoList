import { getDatabase } from './db';
import { Todo } from '../src/hooks/useTodos';

/**
 * Get all todos from the database
 */
export function getAllTodos(): Todo[] {
  const db = getDatabase();
  const stmt = db.prepare('SELECT * FROM todos ORDER BY created_at DESC');
  const rows = stmt.all() as any[];
  
  return rows.map(row => ({
    id: row.id,
    text: row.text,
    completed: Boolean(row.completed), // SQLite stores boolean as 0/1
    priority: row.priority as 'low' | 'medium' | 'high',
    createdAt: new Date(row.created_at),
  }));
}

/**
 * Get a single todo by ID
 */
export function getTodoById(id: string): Todo | null {
  const db = getDatabase();
  const stmt = db.prepare('SELECT * FROM todos WHERE id = ?');
  const row = stmt.get(id) as any;
  
  if (!row) return null;
  
  return {
    id: row.id,
    text: row.text,
    completed: Boolean(row.completed),
    priority: row.priority as 'low' | 'medium' | 'high',
    createdAt: new Date(row.created_at),
  };
}

/**
 * Create a new todo
 */
export function createTodo(todo: Omit<Todo, 'createdAt'>): Todo {
  const db = getDatabase();
  const createdAt = new Date().toISOString();
  
  const stmt = db.prepare(`
    INSERT INTO todos (id, text, completed, priority, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  
  stmt.run(
    todo.id,
    todo.text,
    todo.completed ? 1 : 0,
    todo.priority,
    createdAt,
    createdAt
  );
  
  return {
    ...todo,
    createdAt: new Date(createdAt),
  };
}

/**
 * Update a todo
 */
export function updateTodo(id: string, updates: Partial<Pick<Todo, 'text' | 'completed' | 'priority'>>): Todo | null {
  const db = getDatabase();
  
  // Build dynamic update query
  const fields: string[] = [];
  const values: any[] = [];
  
  if (updates.text !== undefined) {
    fields.push('text = ?');
    values.push(updates.text);
  }
  
  if (updates.completed !== undefined) {
    fields.push('completed = ?');
    values.push(updates.completed ? 1 : 0);
  }
  
  if (updates.priority !== undefined) {
    fields.push('priority = ?');
    values.push(updates.priority);
  }
  
  if (fields.length === 0) {
    return getTodoById(id);
  }
  
  values.push(id);
  
  const stmt = db.prepare(`
    UPDATE todos 
    SET ${fields.join(', ')} 
    WHERE id = ?
  `);
  
  stmt.run(...values);
  
  return getTodoById(id);
}

/**
 * Delete a todo
 */
export function deleteTodo(id: string): boolean {
  const db = getDatabase();
  const stmt = db.prepare('DELETE FROM todos WHERE id = ?');
  const result = stmt.run(id);
  
  return result.changes > 0;
}

/**
 * Delete all completed todos
 */
export function deleteCompletedTodos(): number {
  const db = getDatabase();
  const stmt = db.prepare('DELETE FROM todos WHERE completed = 1');
  const result = stmt.run();
  
  return result.changes;
}

/**
 * Get statistics about todos
 */
export function getTodoStats() {
  const db = getDatabase();
  
  const totalStmt = db.prepare('SELECT COUNT(*) as count FROM todos');
  const completedStmt = db.prepare('SELECT COUNT(*) as count FROM todos WHERE completed = 1');
  const activeStmt = db.prepare('SELECT COUNT(*) as count FROM todos WHERE completed = 0');
  
  const total = (totalStmt.get() as any).count;
  const completed = (completedStmt.get() as any).count;
  const active = (activeStmt.get() as any).count;
  
  return {
    total,
    completed,
    active,
    completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
  };
}

