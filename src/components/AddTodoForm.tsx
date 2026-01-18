import React, { useState } from 'react';
import { Plus, Sparkles, Calendar } from 'lucide-react';

interface AddTodoFormProps {
  onAdd: (text: string, deadline: Date | null) => void;
}

const AddTodoForm: React.FC<AddTodoFormProps> = ({ onAdd }) => {
  const [text, setText] = useState('');
  const [deadline, setDeadline] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      const deadlineDate = deadline ? new Date(deadline) : null;
      onAdd(text.trim(), deadlineDate);
      setText('');
      setDeadline('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="relative">
        {/* Sticky note background shadow */}
        <div className="absolute inset-0 bg-gray-200 transform rotate-1 translate-x-1 translate-y-1 rounded-sm opacity-50"></div>
        
        <div
          className="
            relative p-4 bg-yellow-100 scribble-border
            transform rotate-[-0.5deg] hover:rotate-[0deg] transition-all duration-300
            shadow-md hover:shadow-xl
          "
        >
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="text-yellow-600 w-4 h-4 animate-pulse" />
            <h3 className="text-lg font-handwritten text-gray-800 marker-highlight">New Scribble</h3>
          </div>
          
          <div className="space-y-3">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="What needs to be scribbled down?"
              className="
                w-full px-3 py-2 border-2 border-dashed border-gray-300 rounded-md resize-none
                focus:outline-none focus:border-blue-400
                font-handwritten text-base text-gray-700 placeholder-gray-400
                bg-white/50 backdrop-blur-sm transition-colors
              "
              rows={3}
            />
            
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <Calendar className="text-blue-600 w-4 h-4 flex-shrink-0" />
                <label className="text-sm text-gray-600 font-handwritten">Deadline:</label>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="
                    flex-1 px-2 py-1 text-xs border-2 border-dashed border-gray-300 rounded-md
                    focus:outline-none focus:border-blue-400 font-handwritten
                    bg-white/50 text-gray-700
                  "
                />
                {deadline && (
                  <button
                    type="button"
                    onClick={() => setDeadline('')}
                    className="px-2 py-1 text-xs text-red-500 hover:text-red-700 font-handwritten"
                    title="Clear deadline"
                  >
                    Clear
                  </button>
                )}
              </div>
              
              <button
                type="submit"
                disabled={!text.trim()}
                className="
                  w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white
                  scribble-border transform hover:scale-105 hover:-rotate-1
                  transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                  font-handwritten text-base shadow-lg hover:shadow-xl
                "
              >
                <Plus size={16} strokeWidth={3} />
                Add it!
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default AddTodoForm;