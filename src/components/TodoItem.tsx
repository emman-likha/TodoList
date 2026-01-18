import React, { useState, useEffect } from 'react';
import { Check, X, Edit3, Calendar } from 'lucide-react';

interface TodoItemProps {
  id: string;
  text: string;
  completed: boolean;
  deadline: Date | null;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, newText: string) => void;
  onDeadlineChange: (id: string, deadline: Date | null) => void;
}

const TodoItem: React.FC<TodoItemProps> = ({
  id,
  text,
  completed,
  deadline,
  onToggle,
  onDelete,
  onEdit,
  onDeadlineChange,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(text);
  const [isEditingDeadline, setIsEditingDeadline] = useState(false);
  const [deadlineInput, setDeadlineInput] = useState(deadline ? deadline.toISOString().split('T')[0] : '');

  // Update deadline input when deadline prop changes
  useEffect(() => {
    setDeadlineInput(deadline ? deadline.toISOString().split('T')[0] : '');
  }, [deadline]);

  // Update edit text when text prop changes
  useEffect(() => {
    setEditText(text);
  }, [text]);

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

  const formatDeadline = (deadline: Date | null): string => {
    if (!deadline) return 'No deadline';
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deadlineDate = new Date(deadline);
    deadlineDate.setHours(0, 0, 0, 0);
    
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return `${Math.abs(diffDays)} day${Math.abs(diffDays) !== 1 ? 's' : ''} overdue`;
    } else if (diffDays === 0) {
      return 'Due today';
    } else if (diffDays === 1) {
      return 'Due tomorrow';
    } else if (diffDays <= 7) {
      return `Due in ${diffDays} days`;
    } else {
      return deadlineDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: deadlineDate.getFullYear() !== today.getFullYear() ? 'numeric' : undefined });
    }
  };

  const getDeadlineColor = (deadline: Date | null): string => {
    if (!deadline) return 'text-gray-500';
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deadlineDate = new Date(deadline);
    deadlineDate.setHours(0, 0, 0, 0);
    
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'text-red-600 font-bold';
    if (diffDays === 0) return 'text-red-500 font-semibold';
    if (diffDays <= 2) return 'text-orange-500';
    if (diffDays <= 7) return 'text-yellow-600';
    return 'text-blue-600';
  };

  const handleDeadlineSave = () => {
    const newDeadline = deadlineInput ? new Date(deadlineInput) : null;
    onDeadlineChange(id, newDeadline);
    setIsEditingDeadline(false);
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
      {/* Deadline Tape */}
      {deadline && (
        <div className={`
          absolute -top-2 left-6 px-3 py-0.5 text-[10px] uppercase tracking-widest font-bold
          transform -rotate-2 shadow-sm z-10 font-handwritten
          ${getDeadlineColor(deadline).includes('red') ? 'bg-red-400' : 
            getDeadlineColor(deadline).includes('orange') ? 'bg-orange-400' : 
            getDeadlineColor(deadline).includes('yellow') ? 'bg-yellow-400' : 'bg-blue-400'} text-white
        `}>
          {formatDeadline(deadline)}
        </div>
      )}
      
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

        {/* Deadline & Action buttons */}
        <div className="flex items-center justify-between sm:justify-end gap-3 border-t sm:border-t-0 pt-3 sm:pt-0 border-dashed border-gray-200">
          <div className="flex items-center gap-2">
            {isEditingDeadline ? (
              <div className="flex items-center gap-1">
                <input
                  type="date"
                  value={deadlineInput}
                  onChange={(e) => setDeadlineInput(e.target.value)}
                  onBlur={handleDeadlineSave}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleDeadlineSave();
                    if (e.key === 'Escape') {
                      setDeadlineInput(deadline ? deadline.toISOString().split('T')[0] : '');
                      setIsEditingDeadline(false);
                    }
                  }}
                  className="px-2 py-1 text-xs border-2 border-dashed border-blue-300 rounded focus:outline-none font-handwritten bg-white"
                  autoFocus
                />
              </div>
            ) : (
              <button
                onClick={() => setIsEditingDeadline(true)}
                className={`
                  flex items-center gap-1 px-2 py-1 text-xs rounded-lg border-2 border-dashed transition-all
                  ${deadline 
                    ? `${getDeadlineColor(deadline)} border-gray-300 hover:border-blue-400` 
                    : 'text-gray-400 border-gray-200 hover:border-gray-300'
                  }
                  font-handwritten bg-white/50 hover:bg-white
                `}
                title={deadline ? `Deadline: ${formatDeadline(deadline)}` : 'Set deadline'}
              >
                <Calendar size={12} />
                <span>{formatDeadline(deadline)}</span>
              </button>
            )}
            {deadline && !isEditingDeadline && (
              <button
                onClick={() => onDeadlineChange(id, null)}
                className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                title="Remove deadline"
              >
                <X size={12} />
              </button>
            )}
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