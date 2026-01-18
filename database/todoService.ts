import { getDatabase } from './db';
import { Todo } from '../src/hooks/useTodos';

/**
 * Get all todos from the database
 */
export function getAllTodos(): Todo[] {
  const db = getDatabase();
  const stmt = db.prepare('SELECT * FROM todos ORDER BY deadline IS NULL, deadline ASC, created_at DESC');
  const rows = stmt.all() as any[];
  
  return rows.map(row => ({
    id: row.id,
    text: row.text,
    completed: Boolean(row.completed), // SQLite stores boolean as 0/1
    deadline: row.deadline ? new Date(row.deadline) : null,
    createdAt: new Date(row.created_at),
  }));
}

/**
 * Get a single todo by ID
 */
export function getTodoById(id: string): Todo | null {
  try {
    const db = getDatabase();
    const stmt = db.prepare('SELECT * FROM todos WHERE id = ?');
    const row = stmt.get(id) as any;
    
    if (!row) return null;
    
    return {
      id: row.id,
      text: row.text,
      completed: Boolean(row.completed),
      deadline: row.deadline ? new Date(row.deadline) : null,
      createdAt: new Date(row.created_at),
    };
  } catch (error) {
    console.error('Error getting todo by id:', error);
    return null;
  }
}

/**
 * Create a new todo
 */
export function createTodo(todo: Omit<Todo, 'createdAt'>): Todo {
  try {
    const db = getDatabase();
    const createdAt = new Date().toISOString();
    
    // Check if deadline column exists
    const tableInfo = db.prepare("PRAGMA table_info(todos)").all() as any[];
    const hasDeadline = tableInfo.some(col => col.name === 'deadline');
    
    if (hasDeadline) {
      const stmt = db.prepare(`
        INSERT INTO todos (id, text, completed, deadline, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?)
      `);
      
      stmt.run(
        todo.id,
        todo.text,
        todo.completed ? 1 : 0,
        todo.deadline ? todo.deadline.toISOString() : null,
        createdAt,
        createdAt
      );
    } else {
      // Fallback for old schema without deadline
      const stmt = db.prepare(`
        INSERT INTO todos (id, text, completed, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?)
      `);
      
      stmt.run(
        todo.id,
        todo.text,
        todo.completed ? 1 : 0,
        createdAt,
        createdAt
      );
    }
    
    return {
      ...todo,
      createdAt: new Date(createdAt),
    };
  } catch (error) {
    console.error('Error creating todo:', error);
    throw error;
  }
}

/**
 * Update a todo
 */
export function updateTodo(id: string, updates: Partial<Pick<Todo, 'text' | 'completed' | 'deadline'>>): Todo | null {
  try {
    const db = getDatabase();
    
    // Check if deadline column exists
    const tableInfo = db.prepare("PRAGMA table_info(todos)").all() as any[];
    const hasDeadline = tableInfo.some(col => col.name === 'deadline');
    
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
    
    if (updates.deadline !== undefined && hasDeadline) {
      fields.push('deadline = ?');
      values.push(updates.deadline ? updates.deadline.toISOString() : null);
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
  } catch (error) {
    console.error('Error updating todo:', error);
    return null;
  }
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

