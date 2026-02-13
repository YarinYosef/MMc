'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLayoutStore } from '@/stores/useLayoutStore';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export function LayoutManagerPanel() {
  const {
    layoutManagerOpen,
    toggleLayoutManager,
    savedLayouts,
    currentLayoutId,
    saveCurrentLayout,
    loadLayout,
    deleteLayout,
    toggleWidgetVisibility,
  } = useLayoutStore();

  const currentLayout = savedLayouts.find((l) => l.id === currentLayoutId);

  const [newName, setNewName] = useState('');

  const customCount = savedLayouts.filter((l) => l.id !== 'default').length;
  const canSaveMore = customCount < 4;

  const handleSave = () => {
    if (!newName.trim() || !canSaveMore) return;
    saveCurrentLayout(newName.trim());
    setNewName('');
  };

  return (
    <AnimatePresence>
      {layoutManagerOpen && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.15 }}
          className="fixed top-12 left-4 z-50 w-72 bg-slate-800 border border-slate-700 rounded-lg shadow-xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-slate-700">
            <span className="text-xs font-semibold text-slate-200">Layout Manager</span>
            <button
              onClick={toggleLayoutManager}
              className="text-slate-400 hover:text-slate-200 transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M4 4L10 10M10 4L4 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {/* Layouts list */}
          <div className="p-2 space-y-1 max-h-60 overflow-y-auto">
            {savedLayouts.map((layout) => (
              <div
                key={layout.id}
                className={cn(
                  'flex items-center justify-between px-2 py-1.5 rounded cursor-pointer transition-colors text-xs',
                  layout.id === currentLayoutId
                    ? 'bg-blue-600/20 text-blue-300 border border-blue-600/30'
                    : 'text-slate-300 hover:bg-slate-700'
                )}
                onClick={() => loadLayout(layout.id)}
              >
                <div className="flex items-center gap-2 min-w-0">
                  {layout.id === currentLayoutId && (
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M2 5L4 7L8 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  )}
                  <span className="truncate">{layout.name}</span>
                </div>
                {layout.id !== 'default' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteLayout(layout.id);
                    }}
                    className="text-slate-500 hover:text-red-400 shrink-0 ml-2"
                  >
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                      <path d="M3 3L7 7M7 3L3 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Widget Visibility */}
          {currentLayout && (
            <div className="px-2 pb-1 border-t border-slate-700 pt-2">
              <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1.5">
                Widget Visibility
              </div>
              <div className="grid grid-cols-2 gap-1">
                {currentLayout.widgets.map((widget) => (
                  <button
                    key={widget.id}
                    onClick={() => toggleWidgetVisibility(widget.id)}
                    className={cn(
                      'flex items-center gap-1.5 px-2 py-1 rounded text-[10px] transition-colors',
                      widget.visible
                        ? 'bg-slate-700/50 text-slate-300'
                        : 'bg-slate-800/50 text-slate-600'
                    )}
                  >
                    <span
                      className={cn(
                        'w-2 h-2 rounded-full shrink-0',
                        widget.visible ? 'bg-green-500' : 'bg-slate-600'
                      )}
                    />
                    <span className="capitalize truncate">{widget.type}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Save new layout */}
          <div className="px-2 pb-2">
            <div className="flex gap-1">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder={canSaveMore ? 'New layout name...' : 'Max 4 custom layouts'}
                disabled={!canSaveMore}
                className="flex-1 bg-slate-700 border border-slate-600 rounded px-2 py-1 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSave();
                  if (e.key === 'Escape') {
                    e.stopPropagation();
                    toggleLayoutManager();
                  }
                }}
              />
              <Button
                variant="default"
                size="sm"
                onClick={handleSave}
                disabled={!canSaveMore || !newName.trim()}
              >
                Save
              </Button>
            </div>
            <div className="text-[9px] text-slate-500 mt-1 text-center">
              {customCount}/4 custom layouts | Press ESC to toggle
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
