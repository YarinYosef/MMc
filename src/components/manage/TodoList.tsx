'use client';

import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { type TodoEntry } from '@/data/types/layout';
import { loadFromStorage, saveToStorage } from '@/lib/storageEngine';

const STORAGE_KEY = 'managing-todos';

export function TodoList() {
  const [todos, setTodos] = useState<TodoEntry[]>(() => {
    if (typeof window === 'undefined') return [];
    return loadFromStorage<TodoEntry[]>(STORAGE_KEY) ?? [];
  });
  const [newText, setNewText] = useState('');

  const persist = useCallback((updated: TodoEntry[]) => {
    setTodos(updated);
    saveToStorage(STORAGE_KEY, updated);
  }, []);

  const addTodo = () => {
    if (!newText.trim()) return;
    const entry: TodoEntry = {
      id: uuidv4(),
      text: newText.trim(),
      completed: false,
      createdAt: Date.now(),
    };
    persist([...todos, entry]);
    setNewText('');
  };

  const toggleTodo = (id: string) => {
    persist(todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  const deleteTodo = (id: string) => {
    persist(todos.filter((t) => t.id !== id));
  };

  const moveTodo = (id: string, direction: 'up' | 'down') => {
    const idx = todos.findIndex((t) => t.id === id);
    if (idx < 0) return;
    const newIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (newIdx < 0 || newIdx >= todos.length) return;
    const updated = [...todos];
    [updated[idx], updated[newIdx]] = [updated[newIdx], updated[idx]];
    persist(updated);
  };

  const clearCompleted = () => {
    persist(todos.filter((t) => !t.completed));
  };

  const completedCount = todos.filter((t) => t.completed).length;
  const pendingCount = todos.length - completedCount;

  return (
    <div className="flex flex-col h-full">
      {/* Add form */}
      <div className="flex gap-1.5 mb-3">
        <input
          type="text"
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addTodo()}
          placeholder="Add a task..."
          className="flex-1 bg-slate-800 border border-slate-600 rounded px-2 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
        />
        <button
          onClick={addTodo}
          disabled={!newText.trim()}
          className="px-2.5 py-1.5 text-[10px] rounded bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Add
        </button>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] text-slate-400">
          {pendingCount} pending, {completedCount} done
        </span>
        {completedCount > 0 && (
          <button
            onClick={clearCompleted}
            className="text-[10px] text-slate-500 hover:text-red-400"
          >
            Clear completed
          </button>
        )}
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto space-y-1">
        {todos.length === 0 && (
          <div className="text-center text-slate-500 text-[10px] py-6">
            No tasks yet. Add one above.
          </div>
        )}
        {todos.map((todo, idx) => (
          <div
            key={todo.id}
            className={`flex items-center gap-2 px-2 py-1.5 rounded group ${
              todo.completed ? 'bg-slate-800/30' : 'bg-slate-800/50 hover:bg-slate-700/40'
            }`}
          >
            <button
              onClick={() => toggleTodo(todo.id)}
              className={`w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center ${
                todo.completed
                  ? 'bg-green-600 border-green-600'
                  : 'border-slate-500 hover:border-blue-400'
              }`}
            >
              {todo.completed && (
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M2 5L4 7L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
            <span
              className={`flex-1 text-xs ${
                todo.completed ? 'text-slate-500 line-through' : 'text-slate-200'
              }`}
            >
              {todo.text}
            </span>
            <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => moveTodo(todo.id, 'up')}
                disabled={idx === 0}
                className="text-[10px] text-slate-500 hover:text-slate-300 disabled:opacity-30 px-0.5"
              >
                ^
              </button>
              <button
                onClick={() => moveTodo(todo.id, 'down')}
                disabled={idx === todos.length - 1}
                className="text-[10px] text-slate-500 hover:text-slate-300 disabled:opacity-30 px-0.5"
              >
                v
              </button>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="text-[10px] text-slate-500 hover:text-red-400 px-0.5 ml-1"
              >
                x
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
