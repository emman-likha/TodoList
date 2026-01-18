-- Seed Bible Verses for Scribble Tasks
-- Run this script to populate the bible_verses table with motivational verses

-- Insert motivational Bible verses
INSERT INTO bible_verses (book, chapter, verse, verse_text, category, created_at)
VALUES
    ('Philippians', 4, 13, 'I can do all this through him who gives me strength.', 'strength', CURRENT_TIMESTAMP),
    ('Isaiah', 40, 31, 'But those who hope in the LORD will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint.', 'strength', CURRENT_TIMESTAMP),
    ('Jeremiah', 29, 11, 'For I know the plans I have for you," declares the LORD, "plans to prosper you and not to harm you, plans to give you hope and a future.', 'hope', CURRENT_TIMESTAMP),
    ('Proverbs', 16, 3, 'Commit to the LORD whatever you do, and he will establish your plans.', 'motivation', CURRENT_TIMESTAMP),
    ('Joshua', 1, 9, 'Have I not commanded you? Be strong and courageous. Do not be afraid; do not be discouraged, for the LORD your God will be with you wherever you go.', 'encouragement', CURRENT_TIMESTAMP),
    ('Romans', 8, 28, 'And we know that in all things God works for the good of those who love him, who have been called according to his purpose.', 'hope', CURRENT_TIMESTAMP),
    ('2 Timothy', 1, 7, 'For the Spirit God gave us does not make us timid, but gives us power, love and self-discipline.', 'strength', CURRENT_TIMESTAMP),
    ('Philippians', 4, 6, 'Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God.', 'peace', CURRENT_TIMESTAMP),
    ('Proverbs', 3, 5, 'Trust in the LORD with all your heart and lean not on your own understanding.', 'encouragement', CURRENT_TIMESTAMP),
    ('1 Corinthians', 15, 58, 'Therefore, my dear brothers and sisters, stand firm. Let nothing move you. Always give yourselves fully to the work of the LORD, because you know that your labor in the LORD is not in vain.', 'perseverance', CURRENT_TIMESTAMP),
    ('Galatians', 6, 9, 'Let us not become weary in doing good, for at the proper time we will reap a harvest if we do not give up.', 'perseverance', CURRENT_TIMESTAMP),
    ('Matthew', 6, 34, 'Therefore do not worry about tomorrow, for tomorrow will worry about itself. Each day has enough trouble of its own.', 'peace', CURRENT_TIMESTAMP),
    ('Psalm', 23, 4, 'Even though I walk through the darkest valley, I will fear no evil, for you are with me; your rod and your staff, they comfort me.', 'encouragement', CURRENT_TIMESTAMP),
    ('Ephesians', 2, 10, 'For we are God''s handiwork, created in Christ Jesus to do good works, which God prepared in advance for us to do.', 'motivation', CURRENT_TIMESTAMP),
    ('Colossians', 3, 23, 'Whatever you do, work at it with all your heart, as working for the LORD, not for human masters.', 'motivation', CURRENT_TIMESTAMP)
ON CONFLICT (book, chapter, verse) DO NOTHING;

-- Verify the insertions
SELECT COUNT(*) as total_verses FROM bible_verses;
SELECT category, COUNT(*) as count FROM bible_verses GROUP BY category ORDER BY category;

