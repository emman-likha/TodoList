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
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="relative">
        <div
          className="
            p-6 bg-white/90 border-2 border-dashed border-gray-300 rounded-lg
            transform rotate-[-0.3deg] hover:rotate-[0.2deg] transition-all duration-300
            hover:shadow-lg hover:border-gray-400
          "
          style={{
            clipPath: 'polygon(1% 0%, 99% 1%, 98% 100%, 2% 99%)',
          }}
        >
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="text-yellow-500 w-5 h-5" />
            <h3 className="text-lg font-handwritten text-gray-800">Add a new task</h3>
          </div>
          
          <div className="space-y-4">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="What needs to be done today?"
              className="
                w-full px-4 py-3 border-2 border-gray-200 rounded-lg resize-none
                focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-transparent
                font-handwritten text-gray-700 placeholder-gray-400
                bg-white/70 backdrop-blur-sm
              "
              rows={3}
            />
            
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <label className="text-sm text-gray-600 font-handwritten">Priority:</label>
                {(['low', 'medium', 'high'] as const).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`
                      px-3 py-1 text-sm rounded-full border transition-all
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
              
              <button
                type="submit"
                className="
                  flex items-center gap-2 px-6 py-2 bg-blue-500 text-white rounded-lg
                  hover:bg-blue-600 transition-all duration-200 hover:scale-105
                  font-handwritten shadow-lg hover:shadow-xl
                  transform hover:rotate-1
                "
              >
                <Plus size={18} />
                Add Task
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default AddTodoForm;