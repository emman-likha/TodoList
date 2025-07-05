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
    <div className="mb-6">
      <div
        className="
          p-4 bg-green-50/80 border-2 border-dashed border-green-200 rounded-lg
          transform rotate-[-0.2deg] hover:rotate-[0.1deg] transition-all duration-300
        "
        style={{
          clipPath: 'polygon(2% 1%, 100% 0%, 98% 99%, 0% 100%)',
        }}
      >
        <div className="flex items-center gap-3 mb-3">
          <CheckCircle className="text-green-500 w-5 h-5" />
          <h3 className="text-lg font-handwritten text-gray-800">Progress</h3>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 font-handwritten">
              {totalTodos}
            </div>
            <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
              <Circle size={12} />
              Total
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 font-handwritten">
              {completedTodos}
            </div>
            <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
              <CheckCircle size={12} />
              Done
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600 font-handwritten">
              {activeTodos}
            </div>
            <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
              <Clock size={12} />
              Active
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 font-handwritten">
              {completionRate}%
            </div>
            <div className="text-sm text-gray-600">
              Complete
            </div>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-400 h-2 rounded-full transition-all duration-300"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>
        
        {/* Clear completed button */}
        {completedTodos > 0 && (
          <div className="mt-4 flex justify-end">
            <button
              onClick={onClearCompleted}
              className="
                flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-700
                hover:bg-red-50 rounded-lg transition-colors font-handwritten
              "
            >
              <Trash2 size={16} />
              Clear Completed ({completedTodos})
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Stats;