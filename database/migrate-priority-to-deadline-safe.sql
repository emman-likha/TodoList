-- Safe Migration Script: Replace priority with deadline (SQLite)
-- This script recreates the table to properly remove the priority column
-- WARNING: Backup your data before running this!

BEGIN TRANSACTION;

-- Step 1: Create new table with deadline instead of priority
CREATE TABLE todos_new (
    id TEXT PRIMARY KEY,
    text TEXT NOT NULL,
    completed INTEGER NOT NULL DEFAULT 0,
    deadline TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Step 2: Copy data from old table to new table
INSERT INTO todos_new (id, text, completed, deadline, created_at, updated_at)
SELECT 
    id,
    text,
    completed,
    NULL as deadline, -- Set deadline to NULL (or convert priority if needed)
    created_at,
    updated_at
FROM todos;

-- Step 3: Drop old table
DROP TABLE todos;

-- Step 4: Rename new table
ALTER TABLE todos_new RENAME TO todos;

-- Step 5: Recreate indexes
CREATE INDEX IF NOT EXISTS idx_todos_completed ON todos(completed);
CREATE INDEX IF NOT EXISTS idx_todos_deadline ON todos(deadline);
CREATE INDEX IF NOT EXISTS idx_todos_created_at ON todos(created_at);

-- Step 6: Recreate trigger
CREATE TRIGGER IF NOT EXISTS update_todos_timestamp 
AFTER UPDATE ON todos
BEGIN
    UPDATE todos SET updated_at = datetime('now') WHERE id = NEW.id;
END;

COMMIT;

