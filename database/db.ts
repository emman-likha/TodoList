import * as path from 'path';
import { app } from 'electron';
import * as fs from 'fs';
import { createRequire } from 'module';

// Use createRequire for native modules to avoid bundling issues in ESM
const require = createRequire(import.meta.url);
const Database = require('better-sqlite3');

let db: any = null;

/**
 * Get or create the database connection
 * In Electron, we store the database in the user's app data directory
 */
export function getDatabase(): any {
  if (db) {
    return db;
  }

  // Get the database path
  const userDataPath = app.getPath('userData');
  const dbPath = path.join(userDataPath, 'scribble-tasks.db');
  
  // Ensure the directory exists
  const dbDir = path.dirname(dbPath);
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  // Open database connection
  db = new Database(dbPath);
  
  // Enable foreign keys and other SQLite optimizations
  db.pragma('journal_mode = WAL'); // Write-Ahead Logging for better concurrency
  db.pragma('foreign_keys = ON');
  
  // Initialize schema
  initializeSchema(db);
  
  // Seed Bible verses after schema initialization (synchronous)
  try {
    const bibleService = require('./bibleService');
    bibleService.seedMotivationalVerses();
  } catch (error) {
    console.error('Error seeding Bible verses:', error);
  }
  
  return db;
}

/**
 * Initialize the database schema
 */
function initializeSchema(database: any) {
  // Try to find schema.sql in multiple possible locations
  const possiblePaths = [
    path.join(process.cwd(), 'database', 'schema.sql'), // Development
    path.join(app.getAppPath(), 'database', 'schema.sql'), // Packaged app
    path.join(app.getAppPath(), 'dist-electron', 'database', 'schema.sql'), // Built app
    path.join(__dirname, 'schema.sql'), // If __dirname is available
  ];
  
  let schemaPath: string | null = null;
  for (const possiblePath of possiblePaths) {
    try {
      if (fs.existsSync(possiblePath)) {
        schemaPath = possiblePath;
        break;
      }
    } catch (e) {
      // Continue to next path
    }
  }
  
  if (!schemaPath) {
    // If schema file not found, create it inline
    console.warn('Could not find schema.sql file, using inline schema');
    const inlineSchema = `
      CREATE TABLE IF NOT EXISTS todos (
        id TEXT PRIMARY KEY,
        text TEXT NOT NULL,
        completed INTEGER NOT NULL DEFAULT 0,
        deadline TEXT,
        created_at TEXT NOT NULL DEFAULT (datetime('now')),
        updated_at TEXT NOT NULL DEFAULT (datetime('now'))
      );
      
      CREATE INDEX IF NOT EXISTS idx_todos_completed ON todos(completed);
      CREATE INDEX IF NOT EXISTS idx_todos_deadline ON todos(deadline);
      CREATE INDEX IF NOT EXISTS idx_todos_created_at ON todos(created_at);
      
      CREATE TRIGGER IF NOT EXISTS update_todos_timestamp 
      AFTER UPDATE ON todos
      BEGIN
        UPDATE todos SET updated_at = datetime('now') WHERE id = NEW.id;
      END;
    `;
    database.exec(inlineSchema);
    
    // Migrate existing database if it has priority column
    try {
      const tableInfo = database.prepare("PRAGMA table_info(todos)").all() as any[];
      const hasPriority = tableInfo.some(col => col.name === 'priority');
      const hasDeadline = tableInfo.some(col => col.name === 'deadline');
      
      if (hasPriority && !hasDeadline) {
        console.log('Migrating database: Adding deadline column and removing priority...');
        // Add deadline column
        database.exec('ALTER TABLE todos ADD COLUMN deadline TEXT');
        // Drop old index
        database.exec('DROP INDEX IF EXISTS idx_todos_priority');
        // Create new index
        database.exec('CREATE INDEX IF NOT EXISTS idx_todos_deadline ON todos(deadline)');
        // Note: SQLite doesn't support DROP COLUMN, so priority will remain but be ignored
        console.log('Migration complete: deadline column added');
      }
    } catch (error) {
      console.error('Error during migration:', error);
    }
    
    return;
  }
  
  const schema = fs.readFileSync(schemaPath, 'utf-8');
  
  // Execute schema (better-sqlite3 handles multiple statements)
  database.exec(schema);
  
  // Migrate existing database if it has priority column
  try {
    const tableInfo = database.prepare("PRAGMA table_info(todos)").all() as any[];
    const hasPriority = tableInfo.some(col => col.name === 'priority');
    const hasDeadline = tableInfo.some(col => col.name === 'deadline');
    
    if (hasPriority && !hasDeadline) {
      console.log('Migrating database: Adding deadline column...');
      // Add deadline column
      database.exec('ALTER TABLE todos ADD COLUMN deadline TEXT');
      // Drop old index
      database.exec('DROP INDEX IF EXISTS idx_todos_priority');
      // Create new index
      database.exec('CREATE INDEX IF NOT EXISTS idx_todos_deadline ON todos(deadline)');
      console.log('Migration complete: deadline column added');
    }
  } catch (error) {
    console.error('Error during migration:', error);
  }
}

/**
 * Close the database connection
 */
export function closeDatabase() {
  if (db) {
    db.close();
    db = null;
  }
}

/**
 * Get database path (useful for debugging)
 */
export function getDatabasePath(): string {
  const userDataPath = app.getPath('userData');
  return path.join(userDataPath, 'scribble-tasks.db');
}

