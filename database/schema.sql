-- SQLite Schema for Scribble Tasks
-- This schema is optimized for SQLite (used in Electron apps)

-- Todos table
CREATE TABLE IF NOT EXISTS todos (
    id TEXT PRIMARY KEY,
    text TEXT NOT NULL,
    completed INTEGER NOT NULL DEFAULT 0, -- SQLite uses INTEGER for boolean (0 = false, 1 = true)
    deadline TEXT, -- ISO 8601 format date (nullable)
    created_at TEXT NOT NULL DEFAULT (datetime('now')), -- ISO 8601 format
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_todos_completed ON todos(completed);
CREATE INDEX IF NOT EXISTS idx_todos_deadline ON todos(deadline);
CREATE INDEX IF NOT EXISTS idx_todos_created_at ON todos(created_at);

-- Trigger to update updated_at timestamp on row update
CREATE TRIGGER IF NOT EXISTS update_todos_timestamp 
AFTER UPDATE ON todos
BEGIN
    UPDATE todos SET updated_at = datetime('now') WHERE id = NEW.id;
END;

-- Bible Verses table for motivational content
CREATE TABLE IF NOT EXISTS bible_verses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    book TEXT NOT NULL,
    chapter INTEGER NOT NULL,
    verse INTEGER NOT NULL,
    verse_text TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'motivation' CHECK(category IN ('motivation', 'encouragement', 'strength', 'peace', 'hope', 'perseverance')),
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    UNIQUE(book, chapter, verse)
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_bible_verses_category ON bible_verses(category);
CREATE INDEX IF NOT EXISTS idx_bible_verses_book ON bible_verses(book);

