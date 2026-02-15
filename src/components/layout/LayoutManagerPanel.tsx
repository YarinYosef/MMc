'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLayoutStore } from '@/stores/useLayoutStore';
import { useCompassStore } from '@/stores/useCompassStore';
import { COMPASS_CONFIGS } from '@/data/constants/compassConfig';
import { SIGNAL_COLORS } from '@/data/constants/colors';
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
    updateLayoutSettings,
  } = useLayoutStore();

  const compassStates = useCompassStore((s) => s.compassStates);
  const hidden = useCompassStore((s) => s.barState.hidden);
  const toggleHidden = useCompassStore((s) => s.toggleHidden);

  const handleToggleCompass = (id: Parameters<typeof toggleHidden>[0]) => {
    toggleHidden(id);
    // Persist to current layout after toggle (use timeout to get updated state)
    setTimeout(() => {
      const updatedHidden = Array.from(useCompassStore.getState().barState.hidden) as string[];
      updateLayoutSettings({ hiddenCompasses: updatedHidden });
    }, 0);
  };

  const currentLayout = savedLayouts.find((l) => l.id === currentLayoutId);

  const [newName, setNewName] = useState('');
  const [showCompassSettings, setShowCompassSettings] = useState(false);

  const customCount = savedLayouts.filter((l) => l.id !== 'default').length;
  const canSaveMore = customCount < 4;

  const handleSave = () => {
    if (!newName.trim() || !canSaveMore) return;
    saveCurrentLayout(newName.trim());
    setNewName('');
  };

  const hiddenCount = hidden.size;

  return (
    <AnimatePresence>
      {layoutManagerOpen && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.15 }}
          className="fixed top-12 left-4 z-50 w-72 bg-[#131313] border border-black rounded-lg shadow-xl max-h-[85vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-3 py-2 border-b border-black sticky top-0 bg-[#131313] z-10">
            <span className="text-xs font-semibold text-white">Layout Manager</span>
            <button
              onClick={toggleLayoutManager}
              className="text-[#999999] hover:text-white transition-colors"
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
                    ? 'bg-[#AB9FF2]/20 text-[#AB9FF2] border border-[#AB9FF2]/30'
                    : 'text-[#999999] hover:bg-white/[0.06]'
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
                    className="text-[#777777] hover:text-red-400 shrink-0 ml-2"
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
            <div className="px-2 pb-1 border-t border-black pt-2">
              <div className="text-[10px] text-[#999999] uppercase tracking-wider mb-1.5">
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
                        ? 'bg-white/[0.06] text-white'
                        : 'bg-white/[0.03] text-[#777777]'
                    )}
                  >
                    <span
                      className={cn(
                        'w-2 h-2 rounded-full shrink-0',
                        widget.visible ? 'bg-green-500' : 'bg-white/[0.08]'
                      )}
                    />
                    <span className="capitalize truncate">{widget.type}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Compass Show/Hide */}
          <div className="px-2 pb-1 border-t border-black pt-2">
            <button
              onClick={() => setShowCompassSettings(!showCompassSettings)}
              className="flex items-center justify-between w-full text-[10px] text-[#999999] uppercase tracking-wider mb-1.5"
            >
              <span>Compass Visibility {hiddenCount > 0 ? `(${hiddenCount} hidden)` : ''}</span>
              <svg
                width="10"
                height="10"
                viewBox="0 0 10 10"
                fill="none"
                className={cn('transition-transform duration-200', showCompassSettings && 'rotate-180')}
              >
                <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
            {showCompassSettings && (
              <div className="space-y-0.5 max-h-48 overflow-y-auto">
                {COMPASS_CONFIGS.map((config) => {
                  const isHidden = hidden.has(config.id);
                  const state = compassStates.get(config.id);
                  const signalColor = state ? SIGNAL_COLORS[state.signal] : '#6B7280';
                  return (
                    <button
                      key={config.id}
                      onClick={() => handleToggleCompass(config.id)}
                      className={cn(
                        'flex items-center gap-2 w-full px-1.5 py-1 rounded text-left transition-colors',
                        isHidden ? 'opacity-40 hover:opacity-70' : 'hover:bg-white/[0.06]'
                      )}
                    >
                      <div
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: isHidden ? '#475569' : signalColor }}
                      />
                      <span className="text-[10px] text-white flex-1">{config.shortName}</span>
                      <span className="text-[10px] text-[#999999]">
                        {config.layer === 'decision-maker' ? 'DM' : config.layer === 'safety-net' ? 'SN' : 'SUP'}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Save new layout */}
          <div className="px-2 pb-2 border-t border-black pt-2">
            <div className="flex gap-1">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder={canSaveMore ? 'New layout name...' : 'Max 4 custom layouts'}
                disabled={!canSaveMore}
                className="flex-1 bg-white/[0.06] border border-black rounded px-2 py-1 text-xs text-white placeholder:text-[#777777] focus:outline-none focus:ring-1 focus:ring-[#AB9FF2] disabled:opacity-50"
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
            <div className="text-[10px] text-[#999999] mt-1 text-center">
              {customCount}/4 custom layouts | Press ESC to toggle
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
