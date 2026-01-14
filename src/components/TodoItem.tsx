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

  const priorityStyles = {
    low: 'bg-green-50 border-green-200 text-green-800',
    medium: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    high: 'bg-red-50 border-red-200 text-red-800',
  };

  const priorityMarkers = {
    low: 'bg-green-400',
    medium: 'bg-yellow-400',
    high: 'bg-red-400',
  };

  return (
    <div
      className={`
        relative p-4 sm:p-5 mb-1 bg-white scribble-border transition-all duration-300
        hover:scale-[1.02] hover:-rotate-1 group
        ${completed ? 'opacity-70 bg-gray-50' : 'shadow-sm hover:shadow-md'}
        transform rotate-[0.2deg]
      `}
    >
      {/* Priority Tape */}
      <div className={`
        absolute -top-2 left-6 px-3 py-0.5 text-[10px] uppercase tracking-widest font-bold
        transform -rotate-2 shadow-sm z-10 font-handwritten
        ${priorityMarkers[priority]} text-white
      `}>
        {priority}
      </div>
      
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex items-center gap-4 flex-1">
          {/* Checkbox */}
          <button
            onClick={() => onToggle(id)}
            className={`
              relative w-8 h-8 rounded-full border-2 border-dashed border-gray-400 transition-all duration-200
              hover:scale-110 hover:border-gray-600 flex-shrink-0
              ${completed ? 'bg-green-100 border-green-500' : 'bg-white'}
            `}
          >
            {completed && (
              <Check className="absolute inset-0 w-5 h-5 text-green-600 m-auto animate-in zoom-in duration-300" strokeWidth={3} />
            )}
          </button>

          {/* Text content */}
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <input
                type="text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onBlur={handleEdit}
                onKeyDown={handleKeyPress}
                className="w-full px-3 py-1 bg-yellow-50 border-2 border-dashed border-yellow-300 rounded focus:outline-none font-handwritten text-xl"
                autoFocus
              />
            ) : (
              <span
                className={`
                  block text-gray-800 font-handwritten text-xl sm:text-2xl break-words
                  ${completed ? 'line-through decoration-2 decoration-gray-400 text-gray-500 italic' : 'marker-highlight'}
                `}
              >
                {text}
              </span>
            )}
          </div>
        </div>

        {/* Action buttons & Priority switcher */}
        <div className="flex items-center justify-between sm:justify-end gap-3 border-t sm:border-t-0 pt-3 sm:pt-0 border-dashed border-gray-200">
          <div className="flex gap-1">
            {(['low', 'medium', 'high'] as const).map((p) => (
              <button
                key={p}
                onClick={() => onPriorityChange(id, p)}
                className={`
                  w-6 h-6 rounded-full border-2 transition-all
                  ${priority === p 
                    ? `scale-110 ${priorityMarkers[p]} border-gray-800` 
                    : `bg-white border-gray-200 hover:border-gray-300`
                  }
                `}
                title={`Set ${p} priority`}
              />
            ))}
          </div>

          <div className="h-6 w-[2px] bg-gray-200 mx-1 hidden sm:block" />

          <div className="flex gap-2">
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 text-gray-400 hover:text-blue-500 transition-colors bg-gray-50 sm:bg-transparent rounded-full"
              title="Edit scribble"
            >
              <Edit3 size={18} />
            </button>
            
            <button
              onClick={() => onDelete(id)}
              className="p-2 text-gray-400 hover:text-red-500 transition-colors bg-gray-50 sm:bg-transparent rounded-full"
              title="Discard scribble"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoItem;