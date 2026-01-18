import React, { useState, useMemo } from 'react';
import { BookOpen, Star, Heart } from 'lucide-react';
import TodoItem from './components/TodoItem';
import AddTodoForm from './components/AddTodoForm';
import FilterBar from './components/FilterBar';
import Stats from './components/Stats';
import { useTodos } from './hooks/useTodos';

function App() {
  const {
    todos,
    addTodo,
    toggleTodo,
    deleteTodo,
    editTodo,
    changePriority,
    clearCompleted,
  } = useTodos();

  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'low' | 'medium' | 'high'>('all');

  const filteredTodos = useMemo(() => {
    return todos.filter(todo => {
      const matchesSearch = todo.text.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filter === 'all' || 
        (filter === 'active' && !todo.completed) || 
        (filter === 'completed' && todo.completed);
      const matchesPriority = priorityFilter === 'all' || todo.priority === priorityFilter;
      
      return matchesSearch && matchesFilter && matchesPriority;
    });
  }, [todos, searchTerm, filter, priorityFilter]);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header - Fixed at top */}
      <header className="flex-shrink-0 px-6 py-4 border-b-2 border-dashed border-gray-300 bg-white/80">
        <div className="flex items-center justify-center gap-3">
          <BookOpen className="text-blue-500 w-8 h-8" />
          <h1 className="text-3xl font-bold text-gray-800 font-handwritten scribble-underline">
            Scribble Tasks
          </h1>
          <Star className="text-yellow-500 w-6 h-6" />
        </div>
      </header>

      {/* Main 3-column layout - Takes remaining space */}
      <div className="flex-1 grid grid-cols-12 gap-4 p-4 overflow-hidden">
        {/* Left Column: Stats & Add Todo Form */}
        <div className="col-span-12 lg:col-span-3 flex flex-col gap-4 overflow-y-auto hide-scrollbar">
          {/* Stats */}
          <div className="flex-shrink-0">
            <Stats todos={todos} onClearCompleted={clearCompleted} />
          </div>
          
          {/* Add Todo Form */}
          <div className="flex-shrink-0">
            <AddTodoForm onAdd={addTodo} />
          </div>
        </div>

        {/* Middle Column: Todo List - Main content area */}
        <div className="col-span-12 lg:col-span-6 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto pr-2 hide-scrollbar">
            {filteredTodos.length === 0 ? (
              <div
                className="
                  h-full flex flex-col items-center justify-center p-12 bg-white/50 scribble-border
                  transform rotate-[0.2deg] hover:rotate-[-0.1deg] transition-all duration-300
                "
              >
                <div className="text-gray-500 font-handwritten text-xl mb-3 text-center">
                  {searchTerm || filter !== 'all' || priorityFilter !== 'all' 
                    ? 'No scribbles match your filters...' 
                    : 'Your paper is empty! Start scribbling.'
                  }
                </div>
                <div className="text-gray-400 font-handwritten text-lg italic text-center">
                  {searchTerm || filter !== 'all' || priorityFilter !== 'all' 
                    ? 'Try changing your search or filters' 
                    : 'What is on your mind today?'
                  }
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredTodos.map((todo) => (
                  <TodoItem
                    key={todo.id}
                    id={todo.id}
                    text={todo.text}
                    completed={todo.completed}
                    priority={todo.priority}
                    onToggle={toggleTodo}
                    onDelete={deleteTodo}
                    onEdit={editTodo}
                    onPriorityChange={changePriority}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Filters */}
        <div className="col-span-12 lg:col-span-3 flex flex-col overflow-y-auto hide-scrollbar">
          <div className="flex-shrink-0">
            <FilterBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              filter={filter}
              onFilterChange={setFilter}
              priorityFilter={priorityFilter}
              onPriorityFilterChange={setPriorityFilter}
            />
          </div>
        </div>
      </div>

      {/* Footer - Fixed at bottom */}
      <footer className="flex-shrink-0 px-6 py-2 border-t-2 border-dashed border-gray-300 bg-white/80 text-center">
        <div className="inline-block px-4 py-1 bg-white/40 rounded-full font-handwritten text-gray-500 text-sm">
          Made with <Heart className="inline w-3 h-3 text-red-400 animate-pulse" /> for your productivity
        </div>
      </footer>
    </div>
  );
}

export default App;