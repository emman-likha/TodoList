-- Safe Migration Script: Replace priority with deadline (PostgreSQL)
-- This script properly migrates the todos table
-- WARNING: Backup your data before running this!

BEGIN;

-- Step 1: Add the new deadline column (nullable)
ALTER TABLE todos ADD COLUMN IF NOT EXISTS deadline TIMESTAMP;

-- Step 2: Optional - Convert existing priority values to deadlines
-- Uncomment the following if you want to migrate priority to deadline:
-- UPDATE todos 
-- SET deadline = CURRENT_TIMESTAMP + 
--   CASE priority 
--     WHEN 'high' THEN INTERVAL '1 day'
--     WHEN 'medium' THEN INTERVAL '7 days'
--     WHEN 'low' THEN INTERVAL '30 days'
--   END
-- WHERE deadline IS NULL AND priority IS NOT NULL;

-- Step 3: Drop the old priority index
DROP INDEX IF EXISTS idx_todos_priority;

-- Step 4: Create new deadline index
CREATE INDEX IF NOT EXISTS idx_todos_deadline ON todos(deadline);

-- Step 5: Drop the old priority column
ALTER TABLE todos DROP COLUMN IF EXISTS priority;

COMMIT;

