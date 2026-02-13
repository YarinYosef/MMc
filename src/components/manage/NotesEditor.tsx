'use client';

import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { type NoteEntry } from '@/data/types/layout';
import { useDetailsStore } from '@/stores/useDetailsStore';
import { loadFromStorage, saveToStorage } from '@/lib/storageEngine';

const STORAGE_KEY = 'managing-notes';

export function NotesEditor() {
  const [notes, setNotes] = useState<NoteEntry[]>(() => {
    if (typeof window === 'undefined') return [];
    return loadFromStorage<NoteEntry[]>(STORAGE_KEY) ?? [];
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const selectedSymbol = useDetailsStore((s) => s.selectedSymbol);

  const persist = useCallback((updated: NoteEntry[]) => {
    setNotes(updated);
    saveToStorage(STORAGE_KEY, updated);
  }, []);

  const addNote = () => {
    const newNote: NoteEntry = {
      id: uuidv4(),
      content: '',
      ticker: selectedSymbol ?? undefined,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    const updated = [newNote, ...notes];
    persist(updated);
    setEditingId(newNote.id);
    setEditContent('');
  };

  const saveNote = (id: string) => {
    const updated = notes.map((n) =>
      n.id === id ? { ...n, content: editContent, updatedAt: Date.now() } : n
    );
    persist(updated);
    setEditingId(null);
  };

  const deleteNote = (id: string) => {
    persist(notes.filter((n) => n.id !== id));
    if (editingId === id) setEditingId(null);
  };

  const startEdit = (note: NoteEntry) => {
    setEditingId(note.id);
    setEditContent(note.content);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] text-slate-400">
          {notes.length} note{notes.length !== 1 ? 's' : ''}
          {selectedSymbol && <span className="text-blue-400 ml-1">({selectedSymbol})</span>}
        </span>
        <button
          onClick={addNote}
          className="px-2 py-1 text-[10px] rounded bg-blue-600 text-white hover:bg-blue-500"
        >
          + New Note
        </button>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2">
        {notes.length === 0 && (
          <div className="text-center text-slate-500 text-[10px] py-6">
            No notes yet. Click &quot;+ New Note&quot; to create one.
          </div>
        )}
        {notes.map((note) => (
          <div
            key={note.id}
            className="bg-slate-800/50 rounded-lg border border-slate-700/50 p-2.5"
          >
            {editingId === note.id ? (
              <div>
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-600 rounded px-2 py-1.5 text-xs text-slate-200 resize-none focus:outline-none focus:border-blue-500"
                  rows={4}
                  placeholder="Write your note..."
                  autoFocus
                />
                <div className="flex gap-1 mt-1.5">
                  <button
                    onClick={() => saveNote(note.id)}
                    className="px-2 py-0.5 text-[10px] rounded bg-green-600 text-white hover:bg-green-500"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="px-2 py-0.5 text-[10px] rounded bg-slate-700 text-slate-300 hover:bg-slate-600"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-start justify-between gap-2">
                  <p
                    className="text-xs text-slate-300 flex-1 cursor-pointer whitespace-pre-wrap"
                    onClick={() => startEdit(note)}
                  >
                    {note.content || <span className="text-slate-500 italic">Empty note - click to edit</span>}
                  </p>
                  <button
                    onClick={() => deleteNote(note.id)}
                    className="text-slate-500 hover:text-red-400 text-[10px] flex-shrink-0"
                  >
                    Del
                  </button>
                </div>
                <div className="flex items-center gap-2 mt-1.5">
                  {note.ticker && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400">
                      {note.ticker}
                    </span>
                  )}
                  <span className="text-[9px] text-slate-600">
                    {new Date(note.updatedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
