import React from 'react';
import { CheckCircle, Circle, Clock, Trash2 } from 'lucide-react';
import { Todo } from '../hooks/useTodos';

interface StatsProps {
  todos: Todo[];
  onClearCompleted: () => void;
}

const Stats: React.FC<StatsProps> = ({ todos, onClearCompleted }) => {
  const totalTodos = todos.length;
  const completedTodos = todos.filter(todo => todo.completed).length;
  const activeTodos = totalTodos - completedTodos;
  const completionRate = totalTodos > 0 ? Math.round((completedTodos / totalTodos) * 100) : 0;

  return (
    <div>
      <div
        className="
          p-4 bg-green-50 scribble-border
          transform rotate-[-0.3deg] transition-all duration-300
          shadow-sm h-full
        "
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="text-green-600 w-5 h-5" />
            <h3 className="text-lg font-handwritten text-gray-800 marker-highlight">Progress</h3>
          </div>
          {completedTodos > 0 && (
            <button
              onClick={onClearCompleted}
              className="
                flex items-center gap-1 px-2 py-1 text-red-500 hover:text-red-700
                transition-colors font-handwritten text-sm border-2 border-dashed border-red-200
                hover:border-red-300 rounded-lg bg-white/50
              "
              title="Clear completed"
            >
              <Trash2 size={14} />
            </button>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center group">
            <div className="text-3xl font-bold text-blue-600 font-handwritten transition-transform group-hover:scale-110">
              {totalTodos}
            </div>
            <div className="text-xs text-gray-500 font-handwritten uppercase tracking-wider mt-1">
              Total
            </div>
          </div>
          
          <div className="text-center group">
            <div className="text-3xl font-bold text-green-600 font-handwritten transition-transform group-hover:scale-110">
              {completedTodos}
            </div>
            <div className="text-xs text-gray-500 font-handwritten uppercase tracking-wider mt-1">
              Done
            </div>
          </div>
          
          <div className="text-center group">
            <div className="text-3xl font-bold text-orange-600 font-handwritten transition-transform group-hover:scale-110">
              {activeTodos}
            </div>
            <div className="text-xs text-gray-500 font-handwritten uppercase tracking-wider mt-1">
              Left
            </div>
          </div>
          
          <div className="text-center group">
            <div className="text-3xl font-bold text-purple-600 font-handwritten transition-transform group-hover:scale-110">
              {completionRate}%
            </div>
            <div className="text-xs text-gray-500 font-handwritten uppercase tracking-wider mt-1">
              Score
            </div>
          </div>
        </div>
        
        {/* Progress bar - hand drawn look */}
        <div className="mt-4 relative">
          <div className="w-full bg-gray-200/50 rounded-full h-4 scribble-border p-[2px]">
            <div
              className="bg-green-400 h-full rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${completionRate}%` }}
            />
          </div>
          {completionRate === 100 && totalTodos > 0 && (
            <div className="absolute -top-6 right-0 text-yellow-500 font-handwritten text-lg animate-bounce">
              Perfect! ✨
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Stats;