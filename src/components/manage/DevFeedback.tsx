'use client';

import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { loadFromStorage, saveToStorage } from '@/lib/storageEngine';

const STORAGE_KEY = 'managing-feedback';

interface FeedbackEntry {
  id: string;
  type: 'bug' | 'feature' | 'improvement' | 'other';
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'acknowledged' | 'resolved';
  createdAt: number;
}

const SEVERITY_COLORS: Record<string, string> = {
  low: 'text-slate-400 bg-slate-500/20',
  medium: 'text-amber-400 bg-amber-500/20',
  high: 'text-orange-400 bg-orange-500/20',
  critical: 'text-red-400 bg-red-500/20',
};

const TYPE_LABELS: Record<string, string> = {
  bug: 'Bug',
  feature: 'Feature',
  improvement: 'Improvement',
  other: 'Other',
};

export function DevFeedback() {
  const [entries, setEntries] = useState<FeedbackEntry[]>(() => {
    if (typeof window === 'undefined') return [];
    return loadFromStorage<FeedbackEntry[]>(STORAGE_KEY) ?? [];
  });
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState({
    type: 'bug' as FeedbackEntry['type'],
    title: '',
    description: '',
    severity: 'medium' as FeedbackEntry['severity'],
  });

  const persist = useCallback((updated: FeedbackEntry[]) => {
    setEntries(updated);
    saveToStorage(STORAGE_KEY, updated);
  }, []);

  const submitFeedback = () => {
    if (!form.title.trim()) return;

    const entry: FeedbackEntry = {
      id: uuidv4(),
      type: form.type,
      title: form.title.trim(),
      description: form.description.trim(),
      severity: form.severity,
      status: 'open',
      createdAt: Date.now(),
    };
    persist([entry, ...entries]);
    setForm({ type: 'bug', title: '', description: '', severity: 'medium' });
    setIsAdding(false);
  };

  const updateStatus = (id: string, status: FeedbackEntry['status']) => {
    persist(entries.map((e) => (e.id === id ? { ...e, status } : e)));
  };

  const deleteFeedback = (id: string) => {
    persist(entries.filter((e) => e.id !== id));
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] text-slate-400">
          {entries.filter((e) => e.status === 'open').length} open issues
        </span>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="px-2 py-1 text-[10px] rounded bg-blue-600 text-white hover:bg-blue-500"
        >
          {isAdding ? 'Cancel' : '+ Report Issue'}
        </button>
      </div>

      {/* Add form */}
      {isAdding && (
        <div className="space-y-2 mb-3 p-2.5 bg-slate-800/50 rounded-lg border border-slate-700/50">
          <div className="flex gap-1.5">
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value as FeedbackEntry['type'] })}
              className="bg-slate-800 border border-slate-600 rounded px-2 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
            >
              {Object.entries(TYPE_LABELS).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
            <select
              value={form.severity}
              onChange={(e) => setForm({ ...form, severity: e.target.value as FeedbackEntry['severity'] })}
              className="bg-slate-800 border border-slate-600 rounded px-2 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Title..."
            className="w-full bg-slate-800 border border-slate-600 rounded px-2 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
          />
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Describe the issue or suggestion..."
            rows={3}
            className="w-full bg-slate-800 border border-slate-600 rounded px-2 py-1.5 text-xs text-slate-200 resize-none focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={submitFeedback}
            disabled={!form.title.trim()}
            className="px-3 py-1.5 text-[10px] rounded bg-green-600 text-white hover:bg-green-500 disabled:opacity-40"
          >
            Submit
          </button>
        </div>
      )}

      {/* Entries list */}
      <div className="flex-1 overflow-y-auto space-y-1.5">
        {entries.length === 0 && (
          <div className="text-center text-slate-500 text-[10px] py-6">
            No feedback submitted yet.
          </div>
        )}
        {entries.map((entry) => (
          <div
            key={entry.id}
            className={`px-2.5 py-2 rounded-lg border ${
              entry.status === 'resolved'
                ? 'bg-slate-800/20 border-slate-700/30 opacity-60'
                : 'bg-slate-800/50 border-slate-700/50'
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className={`text-[8px] font-semibold uppercase px-1 py-0.5 rounded ${SEVERITY_COLORS[entry.severity]}`}>
                    {entry.severity}
                  </span>
                  <span className="text-[9px] text-slate-500">{TYPE_LABELS[entry.type]}</span>
                </div>
                <p className="text-xs text-slate-200 font-medium">{entry.title}</p>
                {entry.description && (
                  <p className="text-[10px] text-slate-400 mt-0.5">{entry.description}</p>
                )}
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[9px] text-slate-600">
                    {new Date(entry.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                  <select
                    value={entry.status}
                    onChange={(e) => updateStatus(entry.id, e.target.value as FeedbackEntry['status'])}
                    className="bg-transparent text-[9px] text-slate-400 focus:outline-none cursor-pointer"
                  >
                    <option value="open">Open</option>
                    <option value="acknowledged">Acknowledged</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </div>
              </div>
              <button
                onClick={() => deleteFeedback(entry.id)}
                className="text-[10px] text-slate-500 hover:text-red-400 flex-shrink-0"
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
