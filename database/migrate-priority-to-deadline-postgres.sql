-- Migration Script: Replace priority with deadline in todos table (PostgreSQL)
-- Run this script to migrate existing todos table from priority to deadline

-- Step 1: Add the new deadline column (nullable)
ALTER TABLE todos ADD COLUMN IF NOT EXISTS deadline TIMESTAMP;

-- Step 2: Drop the old priority index
DROP INDEX IF EXISTS idx_todos_priority;

-- Step 3: Create new deadline index
CREATE INDEX IF NOT EXISTS idx_todos_deadline ON todos(deadline);

-- Step 4: Drop the old priority column
ALTER TABLE todos DROP COLUMN IF EXISTS priority;

-- Optional: If you want to convert existing priority values to deadlines
-- You can run this UPDATE statement before dropping the column:
-- UPDATE todos 
-- SET deadline = CURRENT_TIMESTAMP + 
--   CASE priority 
--     WHEN 'high' THEN INTERVAL '1 day'
--     WHEN 'medium' THEN INTERVAL '7 days'
--     WHEN 'low' THEN INTERVAL '30 days'
--   END
-- WHERE deadline IS NULL AND priority IS NOT NULL;

