import { getDatabase } from './db';

export interface BibleVerse {
  id: number;
  book: string;
  chapter: number;
  verse: number;
  verseText: string;
  category: 'motivation' | 'encouragement' | 'strength' | 'peace' | 'hope' | 'perseverance';
  createdAt: Date;
}

export interface BibleVerseReference {
  book: string;
  chapter: number;
  verse: number;
}

/**
 * Get a random motivational Bible verse
 */
export function getRandomVerse(category?: BibleVerse['category']): BibleVerse | null {
  const db = getDatabase();
  
  let stmt;
  if (category) {
    stmt = db.prepare('SELECT * FROM bible_verses WHERE category = ? ORDER BY RANDOM() LIMIT 1');
    const row = stmt.get(category) as any;
    if (!row) return null;
    
    return {
      id: row.id,
      book: row.book,
      chapter: row.chapter,
      verse: row.verse,
      verseText: row.verse_text,
      category: row.category,
      createdAt: new Date(row.created_at),
    };
  } else {
    stmt = db.prepare('SELECT * FROM bible_verses ORDER BY RANDOM() LIMIT 1');
    const row = stmt.get() as any;
    if (!row) return null;
    
    return {
      id: row.id,
      book: row.book,
      chapter: row.chapter,
      verse: row.verse,
      verseText: row.verse_text,
      category: row.category,
      createdAt: new Date(row.created_at),
    };
  }
}

/**
 * Get all verses by category
 */
export function getVersesByCategory(category: BibleVerse['category']): BibleVerse[] {
  const db = getDatabase();
  const stmt = db.prepare('SELECT * FROM bible_verses WHERE category = ? ORDER BY book, chapter, verse');
  const rows = stmt.all(category) as any[];
  
  return rows.map(row => ({
    id: row.id,
    book: row.book,
    chapter: row.chapter,
    verse: row.verse,
    verseText: row.verse_text,
    category: row.category,
    createdAt: new Date(row.created_at),
  }));
}

/**
 * Get a verse by book, chapter, and verse
 */
export function getVerseByReference(reference: BibleVerseReference): BibleVerse | null {
  const db = getDatabase();
  const stmt = db.prepare('SELECT * FROM bible_verses WHERE book = ? AND chapter = ? AND verse = ?');
  const row = stmt.get(reference.book, reference.chapter, reference.verse) as any;
  
  if (!row) return null;
  
  return {
    id: row.id,
    book: row.book,
    chapter: row.chapter,
    verse: row.verse,
    verseText: row.verse_text,
    category: row.category,
    createdAt: new Date(row.created_at),
  };
}

/**
 * Get all verses
 */
export function getAllVerses(): BibleVerse[] {
  const db = getDatabase();
  const stmt = db.prepare('SELECT * FROM bible_verses ORDER BY book, chapter, verse');
  const rows = stmt.all() as any[];
  
  return rows.map(row => ({
    id: row.id,
    book: row.book,
    chapter: row.chapter,
    verse: row.verse,
    verseText: row.verse_text,
    category: row.category,
    createdAt: new Date(row.created_at),
  }));
}

/**
 * Add a new Bible verse
 */
export function addVerse(verse: Omit<BibleVerse, 'id' | 'createdAt'>): BibleVerse {
  const db = getDatabase();
  const createdAt = new Date().toISOString();
  
  const stmt = db.prepare(`
    INSERT INTO bible_verses (book, chapter, verse, verse_text, category, created_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  
  const result = stmt.run(
    verse.book,
    verse.chapter,
    verse.verse,
    verse.verseText,
    verse.category,
    createdAt
  );
  
  return {
    id: Number(result.lastInsertRowid),
    ...verse,
    createdAt: new Date(createdAt),
  };
}

/**
 * Delete a verse by ID
 */
export function deleteVerse(id: number): boolean {
  const db = getDatabase();
  const stmt = db.prepare('DELETE FROM bible_verses WHERE id = ?');
  const result = stmt.run(id);
  
  return result.changes > 0;
}

/**
 * Seed initial motivational Bible verses
 */
export function seedMotivationalVerses() {
  const db = getDatabase();
  
  // Check if verses already exist
  const checkStmt = db.prepare('SELECT COUNT(*) as count FROM bible_verses');
  const count = (checkStmt.get() as any).count;
  
  if (count > 0) {
    console.log('Bible verses already seeded');
    return;
  }
  
  const verses = [
    {
      book: 'Philippians',
      chapter: 4,
      verse: 13,
      verseText: 'I can do all this through him who gives me strength.',
      category: 'strength' as const,
    },
    {
      book: 'Isaiah',
      chapter: 40,
      verse: 31,
      verseText: 'But those who hope in the LORD will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint.',
      category: 'strength' as const,
    },
    {
      book: 'Jeremiah',
      chapter: 29,
      verse: 11,
      verseText: 'For I know the plans I have for you," declares the LORD, "plans to prosper you and not to harm you, plans to give you hope and a future.',
      category: 'hope' as const,
    },
    {
      book: 'Proverbs',
      chapter: 16,
      verse: 3,
      verseText: 'Commit to the LORD whatever you do, and he will establish your plans.',
      category: 'motivation' as const,
    },
    {
      book: 'Joshua',
      chapter: 1,
      verse: 9,
      verseText: 'Have I not commanded you? Be strong and courageous. Do not be afraid; do not be discouraged, for the LORD your God will be with you wherever you go.',
      category: 'encouragement' as const,
    },
    {
      book: 'Romans',
      chapter: 8,
      verse: 28,
      verseText: 'And we know that in all things God works for the good of those who love him, who have been called according to his purpose.',
      category: 'hope' as const,
    },
    {
      book: '2 Timothy',
      chapter: 1,
      verse: 7,
      verseText: 'For the Spirit God gave us does not make us timid, but gives us power, love and self-discipline.',
      category: 'strength' as const,
    },
    {
      book: 'Philippians',
      chapter: 4,
      verse: 6,
      verseText: 'Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God.',
      category: 'peace' as const,
    },
    {
      book: 'Proverbs',
      chapter: 3,
      verse: 5,
      verseText: 'Trust in the LORD with all your heart and lean not on your own understanding.',
      category: 'encouragement' as const,
    },
    {
      book: '1 Corinthians',
      chapter: 15,
      verse: 58,
      verseText: 'Therefore, my dear brothers and sisters, stand firm. Let nothing move you. Always give yourselves fully to the work of the LORD, because you know that your labor in the LORD is not in vain.',
      category: 'perseverance' as const,
    },
    {
      book: 'Galatians',
      chapter: 6,
      verse: 9,
      verseText: 'Let us not become weary in doing good, for at the proper time we will reap a harvest if we do not give up.',
      category: 'perseverance' as const,
    },
    {
      book: 'Matthew',
      chapter: 6,
      verse: 34,
      verseText: 'Therefore do not worry about tomorrow, for tomorrow will worry about itself. Each day has enough trouble of its own.',
      category: 'peace' as const,
    },
    {
      book: 'Psalm',
      chapter: 23,
      verse: 4,
      verseText: 'Even though I walk through the darkest valley, I will fear no evil, for you are with me; your rod and your staff, they comfort me.',
      category: 'encouragement' as const,
    },
    {
      book: 'Ephesians',
      chapter: 2,
      verse: 10,
      verseText: 'For we are God\'s handiwork, created in Christ Jesus to do good works, which God prepared in advance for us to do.',
      category: 'motivation' as const,
    },
    {
      book: 'Colossians',
      chapter: 3,
      verse: 23,
      verseText: 'Whatever you do, work at it with all your heart, as working for the LORD, not for human masters.',
      category: 'motivation' as const,
    },
  ];
  
  const insertStmt = db.prepare(`
    INSERT INTO bible_verses (book, chapter, verse, verse_text, category, created_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  
  const insertMany = db.transaction((verses) => {
    for (const verse of verses) {
      insertStmt.run(
        verse.book,
        verse.chapter,
        verse.verse,
        verse.verseText,
        verse.category,
        new Date().toISOString()
      );
    }
  });
  
  insertMany(verses);
  console.log(`Seeded ${verses.length} motivational Bible verses`);
}

