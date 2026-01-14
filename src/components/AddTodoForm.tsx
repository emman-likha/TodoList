import React, { useState } from 'react';
import { Plus, Sparkles } from 'lucide-react';

interface AddTodoFormProps {
  onAdd: (text: string, priority: 'low' | 'medium' | 'high') => void;
}

const AddTodoForm: React.FC<AddTodoFormProps> = ({ onAdd }) => {
  const [text, setText] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onAdd(text.trim(), priority);
      setText('');
      setPriority('medium');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <div className="relative">
        {/* Sticky note background shadow */}
        <div className="absolute inset-0 bg-gray-200 transform rotate-1 translate-x-1 translate-y-1 rounded-sm opacity-50"></div>
        
        <div
          className="
            relative p-6 bg-yellow-100 scribble-border
            transform rotate-[-0.5deg] hover:rotate-[0deg] transition-all duration-300
            shadow-md hover:shadow-xl
          "
        >
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="text-yellow-600 w-5 h-5 animate-pulse" />
            <h3 className="text-xl font-handwritten text-gray-800 marker-highlight">New Scribble</h3>
          </div>
          
          <div className="space-y-4">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="What needs to be scribbled down?"
              className="
                w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-md resize-none
                focus:outline-none focus:border-blue-400
                font-handwritten text-xl text-gray-700 placeholder-gray-400
                bg-white/50 backdrop-blur-sm transition-colors
              "
              rows={3}
            />
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-base text-gray-600 font-handwritten">Importance:</span>
                <div className="flex gap-2">
                  {(['low', 'medium', 'high'] as const).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={`
                        px-4 py-1 text-sm rounded-full border-2 transition-all font-handwritten
                        ${priority === p 
                          ? 'bg-gray-800 text-white border-gray-800 scale-105' 
                          : 'bg-white/50 text-gray-600 border-gray-300 hover:border-gray-400'
                        }
                      `}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
              
              <button
                type="submit"
                disabled={!text.trim()}
                className="
                  w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 bg-blue-500 text-white
                  scribble-border transform hover:scale-105 hover:-rotate-1
                  transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                  font-handwritten text-xl shadow-lg hover:shadow-xl
                "
              >
                <Plus size={20} strokeWidth={3} />
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