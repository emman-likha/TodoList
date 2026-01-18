-- Bible Verses Schema for Scribble Tasks (SQLite)
-- This schema is specifically for storing motivational Bible verses
-- Note: For PostgreSQL, use schema-bible-postgres.sql instead

-- Bible Verses table
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
CREATE INDEX IF NOT EXISTS idx_bible_verses_book_chapter_verse ON bible_verses(book, chapter, verse);

