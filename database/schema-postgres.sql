-- PostgreSQL Schema for Scribble Tasks
-- Use this if you prefer PostgreSQL over SQLite

-- Todos table
CREATE TABLE IF NOT EXISTS todos (
    id VARCHAR(255) PRIMARY KEY,
    text TEXT NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT FALSE,
    priority VARCHAR(10) NOT NULL DEFAULT 'medium' CHECK(priority IN ('low', 'medium', 'high')),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_todos_completed ON todos(completed);
CREATE INDEX IF NOT EXISTS idx_todos_priority ON todos(priority);
CREATE INDEX IF NOT EXISTS idx_todos_created_at ON todos(created_at);

-- Trigger function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_todos_timestamp 
    BEFORE UPDATE ON todos
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Bible Verses table for motivational content
CREATE TABLE IF NOT EXISTS bible_verses (
    id SERIAL PRIMARY KEY,
    book VARCHAR(50) NOT NULL,
    chapter INTEGER NOT NULL,
    verse INTEGER NOT NULL,
    verse_text TEXT NOT NULL,
    category VARCHAR(20) NOT NULL DEFAULT 'motivation' CHECK(category IN ('motivation', 'encouragement', 'strength', 'peace', 'hope', 'perseverance')),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(book, chapter, verse)
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_bible_verses_category ON bible_verses(category);
CREATE INDEX IF NOT EXISTS idx_bible_verses_book ON bible_verses(book);

