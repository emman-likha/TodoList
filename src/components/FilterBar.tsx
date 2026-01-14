import React from 'react';
import { Search, Filter, RotateCcw } from 'lucide-react';

interface FilterBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  filter: 'all' | 'active' | 'completed';
  onFilterChange: (filter: 'all' | 'active' | 'completed') => void;
  priorityFilter: 'all' | 'low' | 'medium' | 'high';
  onPriorityFilterChange: (priority: 'all' | 'low' | 'medium' | 'high') => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  searchTerm,
  onSearchChange,
  filter,
  onFilterChange,
  priorityFilter,
  onPriorityFilterChange,
}) => {
  const resetFilters = () => {
    onSearchChange('');
    onFilterChange('all');
    onPriorityFilterChange('all');
  };

  return (
    <div className="mb-8">
      <div
        className="
          p-5 bg-purple-50 scribble-border
          transform rotate-[0.3deg] transition-all duration-300
          shadow-sm
        "
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div className="flex items-center gap-3">
            <Filter className="text-purple-600 w-6 h-6" />
            <h3 className="text-xl font-handwritten text-gray-800 marker-highlight">Sort & Search</h3>
          </div>
          <button
            onClick={resetFilters}
            className="
              flex items-center justify-center gap-2 px-4 py-1.5 text-gray-500 hover:text-purple-600
              transition-colors font-handwritten text-lg border-2 border-dashed border-gray-300
              hover:border-purple-300 rounded-lg bg-white/50
            "
          >
            <RotateCcw size={18} />
            Reset All
          </button>
        </div>
        
        <div className="flex flex-col gap-6">
          {/* Search */}
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-purple-500 transition-colors w-5 h-5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Look for a scribble..."
              className="
                w-full pl-12 pr-4 py-3 border-2 border-dashed border-gray-300 rounded-xl
                focus:outline-none focus:border-purple-400 focus:bg-white
                font-handwritten text-xl text-gray-700 placeholder-gray-400
                bg-white/70 transition-all
              "
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Status Filter */}
            <div className="space-y-2">
              <span className="text-sm font-handwritten text-gray-500 ml-1">Status:</span>
              <div className="flex p-1 bg-gray-200/50 rounded-xl scribble-border">
                {(['all', 'active', 'completed'] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => onFilterChange(f)}
                    className={`
                      flex-1 py-2 text-lg rounded-lg transition-all font-handwritten
                      ${filter === f 
                        ? 'bg-purple-500 text-white shadow-md transform -rotate-1' 
                        : 'text-gray-600 hover:bg-white/50'
                      }
                    `}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Priority Filter */}
            <div className="space-y-2">
              <span className="text-sm font-handwritten text-gray-500 ml-1">Importance:</span>
              <div className="flex p-1 bg-gray-200/50 rounded-xl scribble-border">
                {(['all', 'low', 'medium', 'high'] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => onPriorityFilterChange(p)}
                    className={`
                      flex-1 py-2 text-lg rounded-lg transition-all font-handwritten
                      ${priorityFilter === p 
                        ? 'bg-gray-800 text-white shadow-md transform rotate-1' 
                        : 'text-gray-600 hover:bg-white/50'
                      }
                    `}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;