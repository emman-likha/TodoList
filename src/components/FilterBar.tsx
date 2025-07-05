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
    <div className="mb-6">
      <div
        className="
          p-4 bg-purple-50/80 border-2 border-dashed border-purple-200 rounded-lg
          transform rotate-[0.3deg] hover:rotate-[-0.2deg] transition-all duration-300
        "
        style={{
          clipPath: 'polygon(0% 2%, 98% 0%, 100% 97%, 2% 100%)',
        }}
      >
        <div className="flex items-center gap-3 mb-3">
          <Filter className="text-purple-500 w-5 h-5" />
          <h3 className="text-lg font-handwritten text-gray-800">Filter & Search</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search tasks..."
              className="
                w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg
                focus:outline-none focus:ring-2 focus:ring-purple-300 focus:border-transparent
                font-handwritten text-gray-700 placeholder-gray-400
                bg-white/70 backdrop-blur-sm
              "
            />
          </div>
          
          {/* Status Filter */}
          <div className="flex gap-2">
            {(['all', 'active', 'completed'] as const).map((f) => (
              <button
                key={f}
                onClick={() => onFilterChange(f)}
                className={`
                  px-3 py-2 text-sm rounded-lg border transition-all
                  ${filter === f 
                    ? 'bg-purple-500 text-white border-purple-500' 
                    : 'bg-white/70 text-gray-600 border-gray-300 hover:bg-gray-100'
                  }
                `}
              >
                {f}
              </button>
            ))}
          </div>
          
          {/* Priority Filter */}
          <div className="flex gap-2">
            {(['all', 'low', 'medium', 'high'] as const).map((p) => (
              <button
                key={p}
                onClick={() => onPriorityFilterChange(p)}
                className={`
                  px-3 py-2 text-sm rounded-lg border transition-all
                  ${priorityFilter === p 
                    ? 'bg-gray-800 text-white border-gray-800' 
                    : 'bg-white/70 text-gray-600 border-gray-300 hover:bg-gray-100'
                  }
                `}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
        
        <div className="mt-3 flex justify-end">
          <button
            onClick={resetFilters}
            className="
              flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800
              transition-colors font-handwritten
            "
          >
            <RotateCcw size={16} />
            Reset Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;