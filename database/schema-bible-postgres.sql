-- Bible Verses Schema for Scribble Tasks (PostgreSQL)
-- This schema is specifically for storing motivational Bible verses

-- Bible Verses table
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
CREATE INDEX IF NOT EXISTS idx_bible_verses_book_chapter_verse ON bible_verses(book, chapter, verse);

