/**
 * Script to seed Bible verses into PostgreSQL database
 * Run with: node database/seed-bible-verses.js
 */

import pg from 'pg';
const { Client } = pg;

// Database connection configuration
// Update these values to match your PostgreSQL setup
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'scribble_tasks',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
};

const verses = [
  {
    book: 'Philippians',
    chapter: 4,
    verse: 13,
    verseText: 'I can do all this through him who gives me strength.',
    category: 'strength',
  },
  {
    book: 'Isaiah',
    chapter: 40,
    verse: 31,
    verseText: 'But those who hope in the LORD will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint.',
    category: 'strength',
  },
  {
    book: 'Jeremiah',
    chapter: 29,
    verse: 11,
    verseText: 'For I know the plans I have for you," declares the LORD, "plans to prosper you and not to harm you, plans to give you hope and a future.',
    category: 'hope',
  },
  {
    book: 'Proverbs',
    chapter: 16,
    verse: 3,
    verseText: 'Commit to the LORD whatever you do, and he will establish your plans.',
    category: 'motivation',
  },
  {
    book: 'Joshua',
    chapter: 1,
    verse: 9,
    verseText: 'Have I not commanded you? Be strong and courageous. Do not be afraid; do not be discouraged, for the LORD your God will be with you wherever you go.',
    category: 'encouragement',
  },
  {
    book: 'Romans',
    chapter: 8,
    verse: 28,
    verseText: 'And we know that in all things God works for the good of those who love him, who have been called according to his purpose.',
    category: 'hope',
  },
  {
    book: '2 Timothy',
    chapter: 1,
    verse: 7,
    verseText: 'For the Spirit God gave us does not make us timid, but gives us power, love and self-discipline.',
    category: 'strength',
  },
  {
    book: 'Philippians',
    chapter: 4,
    verse: 6,
    verseText: 'Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God.',
    category: 'peace',
  },
  {
    book: 'Proverbs',
    chapter: 3,
    verse: 5,
    verseText: 'Trust in the LORD with all your heart and lean not on your own understanding.',
    category: 'encouragement',
  },
  {
    book: '1 Corinthians',
    chapter: 15,
    verse: 58,
    verseText: 'Therefore, my dear brothers and sisters, stand firm. Let nothing move you. Always give yourselves fully to the work of the LORD, because you know that your labor in the LORD is not in vain.',
    category: 'perseverance',
  },
  {
    book: 'Galatians',
    chapter: 6,
    verse: 9,
    verseText: 'Let us not become weary in doing good, for at the proper time we will reap a harvest if we do not give up.',
    category: 'perseverance',
  },
  {
    book: 'Matthew',
    chapter: 6,
    verse: 34,
    verseText: 'Therefore do not worry about tomorrow, for tomorrow will worry about itself. Each day has enough trouble of its own.',
    category: 'peace',
  },
  {
    book: 'Psalm',
    chapter: 23,
    verse: 4,
    verseText: 'Even though I walk through the darkest valley, I will fear no evil, for you are with me; your rod and your staff, they comfort me.',
    category: 'encouragement',
  },
  {
    book: 'Ephesians',
    chapter: 2,
    verse: 10,
    verseText: 'For we are God\'s handiwork, created in Christ Jesus to do good works, which God prepared in advance for us to do.',
    category: 'motivation',
  },
  {
    book: 'Colossians',
    chapter: 3,
    verse: 23,
    verseText: 'Whatever you do, work at it with all your heart, as working for the LORD, not for human masters.',
    category: 'motivation',
  },
];

async function seedBibleVerses() {
  const client = new Client(dbConfig);

  try {
    await client.connect();
    console.log('Connected to PostgreSQL database');

    // Check if verses already exist
    const checkResult = await client.query('SELECT COUNT(*) as count FROM bible_verses');
    const count = parseInt(checkResult.rows[0].count);

    if (count > 0) {
      console.log(`Database already contains ${count} verses. Skipping seed.`);
      console.log('To re-seed, delete existing verses first.');
      return;
    }

    // Insert verses
    console.log(`Inserting ${verses.length} Bible verses...`);

    for (const verse of verses) {
      await client.query(
        `INSERT INTO bible_verses (book, chapter, verse, verse_text, category, created_at)
         VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)
         ON CONFLICT (book, chapter, verse) DO NOTHING`,
        [verse.book, verse.chapter, verse.verse, verse.verseText, verse.category]
      );
    }

    // Verify insertions
    const result = await client.query('SELECT COUNT(*) as count FROM bible_verses');
    const finalCount = parseInt(result.rows[0].count);

    const categoryResult = await client.query(
      'SELECT category, COUNT(*) as count FROM bible_verses GROUP BY category ORDER BY category'
    );

    console.log(`\n✅ Successfully seeded ${finalCount} Bible verses!`);
    console.log('\nVerses by category:');
    categoryResult.rows.forEach(row => {
      console.log(`  ${row.category}: ${row.count} verses`);
    });

  } catch (error) {
    console.error('Error seeding Bible verses:', error);
    process.exit(1);
  } finally {
    await client.end();
    console.log('\nDatabase connection closed.');
  }
}

seedBibleVerses();

