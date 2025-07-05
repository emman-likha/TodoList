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
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50">
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 text-yellow-300 opacity-20 transform rotate-12">
        <Star size={60} />
      </div>
      <div className="absolute top-32 right-16 text-pink-300 opacity-20 transform -rotate-12">
        <Heart size={40} />
      </div>
      <div className="absolute bottom-20 left-20 text-blue-300 opacity-20 transform rotate-45">
        <BookOpen size={50} />
      </div>
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <header className="text-center mb-8">
          <div
            className="
              inline-block p-6 bg-white/80 border-2 border-dashed border-gray-400 rounded-lg
              transform rotate-[-1deg] hover:rotate-[0.5deg] transition-all duration-300
              shadow-lg hover:shadow-xl
            "
            style={{
              clipPath: 'polygon(3% 0%, 97% 2%, 100% 97%, 2% 100%)',
            }}
          >
            <div className="flex items-center justify-center gap-3 mb-2">
              <BookOpen className="text-blue-500 w-8 h-8" />
              <h1 className="text-4xl font-bold text-gray-800 font-handwritten">
                My Scribble Tasks
              </h1>
              <Star className="text-yellow-500 w-6 h-6" />
            </div>
            <p className="text-gray-600 font-handwritten text-lg">
              Organize your thoughts, one scribble at a time
            </p>
          </div>
        </header>

        {/* Stats */}
        <Stats todos={todos} onClearCompleted={clearCompleted} />

        {/* Filter Bar */}
        <FilterBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          filter={filter}
          onFilterChange={setFilter}
          priorityFilter={priorityFilter}
          onPriorityFilterChange={setPriorityFilter}
        />

        {/* Add Todo Form */}
        <AddTodoForm onAdd={addTodo} />

        {/* Todo List */}
        <div className="space-y-2">
          {filteredTodos.length === 0 ? (
            <div
              className="
                text-center p-12 bg-gray-50/80 border-2 border-dashed border-gray-300 rounded-lg
                transform rotate-[0.2deg] hover:rotate-[-0.1deg] transition-all duration-300
              "
              style={{
                clipPath: 'polygon(1% 2%, 99% 0%, 100% 98%, 0% 100%)',
              }}
            >
              <div className="text-gray-500 font-handwritten text-lg mb-2">
                {searchTerm || filter !== 'all' || priorityFilter !== 'all' 
                  ? 'No tasks match your filters' 
                  : 'No tasks yet! Add your first one above.'
                }
              </div>
              <div className="text-gray-400 font-handwritten">
                {searchTerm || filter !== 'all' || priorityFilter !== 'all' 
                  ? 'Try adjusting your search or filters' 
                  : 'What would you like to accomplish today?'
                }
              </div>
            </div>
          ) : (
            filteredTodos.map((todo) => (
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
            ))
          )}
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center">
          <div className="text-gray-500 font-handwritten">
            Made with <Heart className="inline w-4 h-4 text-red-400" /> for productivity
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;