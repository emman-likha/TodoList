import React from 'react';
import { Search, Filter, RotateCcw } from 'lucide-react';

interface FilterBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  filter: 'all' | 'active' | 'completed';
  onFilterChange: (filter: 'all' | 'active' | 'completed') => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  searchTerm,
  onSearchChange,
  filter,
  onFilterChange,
}) => {
  const resetFilters = () => {
    onSearchChange('');
    onFilterChange('all');
  };

  return (
    <div>
      <div
        className="
          p-4 bg-purple-50 scribble-border
          transform rotate-[0.3deg] transition-all duration-300
          shadow-sm
        "
      >
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <Filter className="text-purple-600 w-5 h-5" />
            <h3 className="text-lg font-handwritten text-gray-800 marker-highlight">Filters</h3>
          </div>
          <button
            onClick={resetFilters}
            className="
              flex items-center justify-center gap-1 px-2 py-1 text-gray-500 hover:text-purple-600
              transition-colors font-handwritten text-sm border-2 border-dashed border-gray-300
              hover:border-purple-300 rounded-lg bg-white/50
            "
            title="Reset filters"
          >
            <RotateCcw size={14} />
          </button>
        </div>
        
        <div className="flex flex-col gap-4">
          {/* Search */}
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-purple-500 transition-colors w-4 h-4" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search..."
              className="
                w-full pl-10 pr-3 py-2 border-2 border-dashed border-gray-300 rounded-lg
                focus:outline-none focus:border-purple-400 focus:bg-white
                font-handwritten text-sm text-gray-700 placeholder-gray-400
                bg-white/70 transition-all
              "
            />
          </div>
          
          {/* Status Filter */}
          <div className="space-y-1">
            <span className="text-xs font-handwritten text-gray-500 ml-1">Status:</span>
            <div className="flex p-1 bg-gray-200/50 rounded-lg scribble-border">
              {(['all', 'active', 'completed'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => onFilterChange(f)}
                  className={`
                    flex-1 py-1.5 text-xs rounded-md transition-all font-handwritten
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
        </div>
      </div>
    </div>
  );
};

export default FilterBar;