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
    <div className="min-h-screen pb-12 overflow-x-hidden">
      {/* Decorative elements - Hidden on small mobile */}
      <div className="hidden sm:block absolute top-10 left-10 text-yellow-300 opacity-30 transform rotate-12 animate-gentle-float">
        <Star size={60} />
      </div>
      <div className="hidden sm:block absolute top-32 right-16 text-pink-300 opacity-30 transform -rotate-12 animate-pulse">
        <Heart size={40} />
      </div>
      <div className="hidden sm:block absolute bottom-20 left-10 text-blue-300 opacity-30 transform rotate-45">
        <BookOpen size={50} />
      </div>
      
      <div className="container mx-auto px-4 py-6 sm:py-12 max-w-3xl">
        {/* Header */}
        <header className="text-center mb-10 sm:mb-12">
          <div
            className="
              inline-block p-6 sm:p-8 bg-white scribble-border
              transform rotate-[-1deg] hover:rotate-[0.5deg] transition-all duration-300
              shadow-[8px_8px_0px_rgba(0,0,0,0.1)] hover:shadow-[12px_12px_0px_rgba(0,0,0,0.1)]
            "
          >
            <div className="flex items-center justify-center gap-3 mb-3">
              <BookOpen className="text-blue-500 w-8 h-8 sm:w-10 sm:h-10" />
              <h1 className="text-3xl sm:text-5xl font-bold text-gray-800 font-handwritten scribble-underline">
                Scribble Tasks
              </h1>
              <Star className="text-yellow-500 w-6 h-6 sm:w-8 sm:h-8" />
            </div>
            <p className="text-gray-600 font-handwritten text-lg sm:text-xl">
              Organize your thoughts, one scribble at a time
            </p>
          </div>
        </header>

        <div className="space-y-8">
          {/* Stats section */}
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Stats todos={todos} onClearCompleted={clearCompleted} />
          </section>

          {/* Add Todo section - Sticky note style */}
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-75">
            <AddTodoForm onAdd={addTodo} />
          </section>

          {/* Filters section */}
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150">
            <FilterBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              filter={filter}
              onFilterChange={setFilter}
              priorityFilter={priorityFilter}
              onPriorityFilterChange={setPriorityFilter}
            />
          </section>

          {/* Todo List section */}
          <section className="space-y-4 min-h-[200px]">
            {filteredTodos.length === 0 ? (
              <div
                className="
                  text-center p-12 bg-white/50 scribble-border
                  transform rotate-[0.2deg] hover:rotate-[-0.1deg] transition-all duration-300
                "
              >
                <div className="text-gray-500 font-handwritten text-xl mb-3">
                  {searchTerm || filter !== 'all' || priorityFilter !== 'all' 
                    ? 'No scribbles match your filters...' 
                    : 'Your paper is empty! Start scribbling.'
                  }
                </div>
                <div className="text-gray-400 font-handwritten text-lg italic">
                  {searchTerm || filter !== 'all' || priorityFilter !== 'all' 
                    ? 'Try changing your search or filters' 
                    : 'What is on your mind today?'
                  }
                </div>
              </div>
            ) : (
              <div className="grid gap-3">
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
          </section>
        </div>

        {/* Footer */}
        <footer className="mt-16 text-center">
          <div className="inline-block px-4 py-2 bg-white/40 rounded-full font-handwritten text-gray-500">
            Made with <Heart className="inline w-4 h-4 text-red-400 animate-pulse" /> for your productivity
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;