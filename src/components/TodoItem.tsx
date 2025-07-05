import React, { useState } from 'react';
import { Check, X, Edit3, RotateCcw } from 'lucide-react';

interface TodoItemProps {
  id: string;
  text: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, newText: string) => void;
  onPriorityChange: (id: string, priority: 'low' | 'medium' | 'high') => void;
}

const TodoItem: React.FC<TodoItemProps> = ({
  id,
  text,
  completed,
  priority,
  onToggle,
  onDelete,
  onEdit,
  onPriorityChange,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(text);

  const handleEdit = () => {
    if (editText.trim()) {
      onEdit(id, editText.trim());
      setIsEditing(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleEdit();
    } else if (e.key === 'Escape') {
      setEditText(text);
      setIsEditing(false);
    }
  };

  const priorityColors = {
    low: 'bg-green-100 border-green-300',
    medium: 'bg-yellow-100 border-yellow-300',
    high: 'bg-red-100 border-red-300',
  };

  const priorityDots = {
    low: 'bg-green-400',
    medium: 'bg-yellow-400',
    high: 'bg-red-400',
  };

  return (
    <div
      className={`
        relative p-4 mb-3 rounded-lg border-2 border-dashed transition-all duration-300
        hover:scale-105 hover:rotate-1 hover:shadow-lg
        ${priorityColors[priority]}
        ${completed ? 'opacity-60' : ''}
        transform rotate-[-0.5deg] hover:rotate-[0.5deg]
      `}
      style={{
        clipPath: 'polygon(2% 0%, 98% 2%, 100% 98%, 0% 96%)',
      }}
    >
      {/* Priority indicator */}
      <div className={`absolute top-2 right-2 w-3 h-3 rounded-full ${priorityDots[priority]}`} />
      
      <div className="flex items-center gap-3">
        {/* Checkbox */}
        <button
          onClick={() => onToggle(id)}
          className={`
            relative w-6 h-6 rounded-full border-2 border-gray-400 transition-all duration-200
            hover:scale-110 hover:border-gray-600
            ${completed ? 'bg-green-400 border-green-400' : 'bg-white'}
          `}
        >
          {completed && (
            <Check className="absolute inset-0 w-4 h-4 text-white m-auto animate-bounce" />
          )}
        </button>

        {/* Text content */}
        <div className="flex-1">
          {isEditing ? (
            <input
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onBlur={handleEdit}
              onKeyDown={handleKeyPress}
              className="w-full px-2 py-1 bg-white/80 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
              autoFocus
            />
          ) : (
            <span
              className={`
                text-gray-800 font-handwritten text-lg
                ${completed ? 'line-through text-gray-500' : ''}
              `}
            >
              {text}
            </span>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => setIsEditing(true)}
            className="p-1 text-gray-500 hover:text-blue-500 transition-colors"
            title="Edit"
          >
            <Edit3 size={16} />
          </button>
          
          <button
            onClick={() => onDelete(id)}
            className="p-1 text-gray-500 hover:text-red-500 transition-colors"
            title="Delete"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Priority selector */}
      <div className="mt-2 flex gap-2">
        {(['low', 'medium', 'high'] as const).map((p) => (
          <button
            key={p}
            onClick={() => onPriorityChange(id, p)}
            className={`
              px-2 py-1 text-xs rounded-full border transition-all
              ${priority === p 
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
  );
};

export default TodoItem;