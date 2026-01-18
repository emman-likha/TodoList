import { useState, useEffect } from 'react';
import { bibleAPI } from '../api/bible';

export interface BibleVerse {
  id: number;
  book: string;
  chapter: number;
  verse: number;
  verseText: string;
  category: 'motivation' | 'encouragement' | 'strength' | 'peace' | 'hope' | 'perseverance';
  createdAt: Date;
}

export const useBibleVerses = () => {
  const [currentVerse, setCurrentVerse] = useState<BibleVerse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Get verse of the day (changes daily)
   */
  const getVerseOfTheDay = async () => {
    try {
      setLoading(true);
      setError(null);
      const verse = await bibleAPI.getVerseOfTheDay();
      setCurrentVerse(verse);
    } catch (err) {
      console.error('Error getting verse of the day:', err);
      setError('Failed to load verse');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Get a random motivational verse
   */
  const getRandomVerse = async (category?: BibleVerse['category']) => {
    try {
      setLoading(true);
      setError(null);
      const verse = await bibleAPI.getRandom(category);
      setCurrentVerse(verse);
    } catch (err) {
      console.error('Error getting random verse:', err);
      setError('Failed to load verse');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Get verses by category
   */
  const getVersesByCategory = async (category: BibleVerse['category']) => {
    try {
      setLoading(true);
      setError(null);
      return await bibleAPI.getByCategory(category);
    } catch (err) {
      console.error('Error getting verses by category:', err);
      setError('Failed to load verses');
      return [];
    } finally {
      setLoading(false);
    }
  };

  /**
   * Get a verse by reference
   */
  const getVerseByReference = async (reference: { book: string; chapter: number; verse: number }) => {
    try {
      setLoading(true);
      setError(null);
      const verse = await bibleAPI.getByReference(reference);
      setCurrentVerse(verse);
      return verse;
    } catch (err) {
      console.error('Error getting verse by reference:', err);
      setError('Failed to load verse');
      return null;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Format verse reference (e.g., "Philippians 4:13")
   */
  const formatReference = (verse: BibleVerse | null): string => {
    if (!verse) return '';
    return `${verse.book} ${verse.chapter}:${verse.verse}`;
  };

  return {
    currentVerse,
    loading,
    error,
    getVerseOfTheDay,
    getRandomVerse,
    getVersesByCategory,
    getVerseByReference,
    formatReference,
  };
};

