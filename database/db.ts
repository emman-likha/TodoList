import Database from 'better-sqlite3';
import * as path from 'path';
import { app } from 'electron';
import * as fs from 'fs';

let db: Database.Database | null = null;

/**
 * Get or create the database connection
 * In Electron, we store the database in the user's app data directory
 */
export function getDatabase(): Database.Database {
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
  
  return db;
}

/**
 * Initialize the database schema
 */
function initializeSchema(database: Database.Database) {
  // Try to find schema.sql in multiple possible locations
  const possiblePaths = [
    path.join(__dirname, 'schema.sql'), // Production build
    path.join(process.cwd(), 'database', 'schema.sql'), // Development
    path.join(app.getAppPath(), 'database', 'schema.sql'), // Packaged app
  ];
  
  let schemaPath: string | null = null;
  for (const possiblePath of possiblePaths) {
    if (fs.existsSync(possiblePath)) {
      schemaPath = possiblePath;
      break;
    }
  }
  
  if (!schemaPath) {
    console.error('Could not find schema.sql file');
    return;
  }
  
  const schema = fs.readFileSync(schemaPath, 'utf-8');
  
  // Execute schema (better-sqlite3 handles multiple statements)
  database.exec(schema);
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

