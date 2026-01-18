import React, { useEffect, useState } from 'react';
import { BookOpen, RefreshCw } from 'lucide-react';
import { useBibleVerses } from '../hooks/useBibleVerses';

const VerseOfTheDay: React.FC = () => {
  const { currentVerse, getVerseOfTheDay, formatReference, loading } = useBibleVerses();
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Load verse of the day on mount
  useEffect(() => {
    loadVerseOfTheDay();
  }, []);

  const loadVerseOfTheDay = async () => {
    setIsRefreshing(true);
    // Get verse of the day (changes daily based on date)
    await getVerseOfTheDay();
    setIsRefreshing(false);
  };

  if (loading && !currentVerse) {
    return (
      <div className="p-4 bg-blue-50 scribble-border animate-pulse">
        <div className="h-20 bg-white/50 rounded"></div>
      </div>
    );
  }

  if (!currentVerse) {
    return null;
  }

  return (
    <div className="relative">
      {/* Decorative shadow */}
      <div className="absolute inset-0 bg-gray-200 transform rotate-1 translate-x-1 translate-y-1 rounded-sm opacity-30"></div>
      
      <div
        className="
          relative p-4 bg-gradient-to-br from-blue-50 to-indigo-50 scribble-border
          transform rotate-[0.3deg] hover:rotate-[0deg] transition-all duration-300
          shadow-sm hover:shadow-md
        "
      >
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <BookOpen className="text-blue-600 w-5 h-5 flex-shrink-0" />
            <h3 className="text-lg font-handwritten text-gray-800 marker-highlight">
              Verse of the Day
            </h3>
          </div>
          <button
            onClick={loadVerseOfTheDay}
            disabled={isRefreshing}
            className="
              p-1.5 text-blue-600 hover:text-blue-700 hover:bg-blue-100 rounded-full
              transition-colors disabled:opacity-50 disabled:cursor-not-allowed
            "
            title="Refresh verse"
          >
            <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
          </button>
        </div>
        
        <div className="space-y-2">
          <p className="text-base font-handwritten text-gray-700 leading-relaxed italic">
            "{currentVerse.verseText}"
          </p>
          <p className="text-sm font-handwritten text-blue-700 font-semibold">
            — {formatReference(currentVerse)}
          </p>
        </div>
        
        <div className="mt-3 pt-2 border-t border-dashed border-blue-200">
          <p className="text-xs text-gray-500 font-handwritten italic">
            💪 Let this inspire your productivity today
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerseOfTheDay;

