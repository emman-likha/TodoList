-- Migration Script: Replace priority with deadline in todos table (SQLite)
-- Run this script to migrate existing todos table from priority to deadline

-- Step 1: Add the new deadline column (nullable)
ALTER TABLE todos ADD COLUMN deadline TEXT;

-- Step 2: Drop the old priority index
DROP INDEX IF EXISTS idx_todos_priority;

-- Step 3: Create new deadline index
CREATE INDEX IF NOT EXISTS idx_todos_deadline ON todos(deadline);

-- Step 4: Drop the old priority column
-- Note: SQLite doesn't support DROP COLUMN directly, so we'll need to recreate the table
-- This is a simplified version - for production, you may want to backup data first

-- Optional: If you want to convert existing priority values to deadlines
-- You can run this UPDATE statement before dropping the column:
-- UPDATE todos SET deadline = date('now', '+' || 
--   CASE priority 
--     WHEN 'high' THEN '1 day'
--     WHEN 'medium' THEN '7 days'
--     WHEN 'low' THEN '30 days'
--   END || '') 
-- WHERE deadline IS NULL AND priority IS NOT NULL;

