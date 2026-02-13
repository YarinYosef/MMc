'use client';

import { useCallback, useId, useMemo, useState, useEffect, useRef } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
  DragOverlay,
} from '@dnd-kit/core';
import {
  SortableContext,
  horizontalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { useCompassStore } from '@/stores/useCompassStore';
import { COMPASS_CONFIGS } from '@/data/constants/compassConfig';
import { SIGNAL_COLORS } from '@/data/constants/colors';
import { type CompassId } from '@/data/types/compass';
import { CompassWidget } from './CompassWidget';
import { cn } from '@/lib/utils';

export function CompassBar() {
  const dndId = useId();
  const { compassStates, barState } = useCompassStore();
  const { order, layerFilter, hidden, expanded } = barState;
  const reorderCompasses = useCompassStore((s) => s.reorderCompasses);
  const setExpanded = useCompassStore((s) => s.setExpanded);

  const [activeDragId, setActiveDragId] = useState<CompassId | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor)
  );

  const filteredOrder = useMemo(() => {
    let ids = order;
    if (layerFilter !== 'all') {
      const layerIds = new Set(
        COMPASS_CONFIGS.filter((c) => c.layer === layerFilter).map((c) => c.id)
      );
      ids = ids.filter((id) => layerIds.has(id));
    }
    return ids.filter((id) => !hidden.has(id));
  }, [order, layerFilter, hidden]);

  const configMap = useMemo(() => {
    const map = new Map<CompassId, (typeof COMPASS_CONFIGS)[number]>();
    for (const c of COMPASS_CONFIGS) map.set(c.id, c);
    return map;
  }, []);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveDragId(event.active.id as CompassId);
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      setActiveDragId(null);
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      const oldIndex = order.indexOf(active.id as CompassId);
      const newIndex = order.indexOf(over.id as CompassId);
      if (oldIndex === -1 || newIndex === -1) return;

      const newOrder = arrayMove([...order], oldIndex, newIndex);
      reorderCompasses(newOrder);
    },
    [order, reorderCompasses]
  );

  // Click outside to close expanded compass
  useEffect(() => {
    if (!expanded) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-compass-widget]') && !target.closest('[data-compass-expanded]')) {
        setExpanded(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [expanded, setExpanded]);

  // Click outside to close settings
  useEffect(() => {
    if (!showSettings) return;
    const handler = (e: MouseEvent) => {
      if (settingsRef.current && !settingsRef.current.contains(e.target as Node)) {
        setShowSettings(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showSettings]);

  const hiddenCount = hidden.size;
  const activeConfig = activeDragId ? configMap.get(activeDragId) : null;
  const activeState = activeDragId ? compassStates.get(activeDragId) : null;

  return (
    <div className="flex items-stretch gap-0 bg-slate-900/95 backdrop-blur-sm">
      {/* Layer filter + settings buttons */}
      <div className="flex items-center gap-1 px-2 py-1 border-r border-slate-800 shrink-0">
        {(['all', 'decision-maker', 'safety-net', 'support'] as const).map((layer) => (
          <button
            key={layer}
            onClick={() => useCompassStore.getState().setLayerFilter(layer)}
            className={cn(
              'px-2 py-0.5 text-[10px] rounded-full border transition-colors',
              layerFilter === layer
                ? 'border-blue-500 text-blue-400 bg-blue-500/10'
                : 'border-slate-700 text-slate-500 hover:text-slate-300'
            )}
          >
            {layer === 'all' ? 'ALL' : layer === 'decision-maker' ? 'DM' : layer === 'safety-net' ? 'SN' : 'SUP'}
          </button>
        ))}

        {/* Settings toggle */}
        <div className="relative" ref={settingsRef}>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={cn(
              'ml-1 px-1.5 py-0.5 text-[10px] rounded border transition-colors',
              showSettings
                ? 'border-blue-500 text-blue-400 bg-blue-500/10'
                : 'border-slate-700 text-slate-500 hover:text-slate-300'
            )}
            title="Toggle compass visibility"
          >
            {hiddenCount > 0 ? `\u2699 ${hiddenCount}` : '\u2699'}
          </button>

          {showSettings && (
            <div className="absolute top-full left-0 mt-1 z-50 bg-slate-800 border border-slate-700 rounded-lg shadow-xl p-2 w-48 max-h-80 overflow-y-auto">
              <div className="text-[9px] text-slate-500 uppercase tracking-wider mb-1.5 px-1">Show/Hide Compasses</div>
              {COMPASS_CONFIGS.map((config) => {
                const isHidden = hidden.has(config.id);
                const state = compassStates.get(config.id);
                const signalColor = state ? SIGNAL_COLORS[state.signal] : '#6B7280';
                return (
                  <button
                    key={config.id}
                    onClick={() => useCompassStore.getState().toggleHidden(config.id)}
                    className={cn(
                      'flex items-center gap-2 w-full px-1.5 py-1 rounded text-left transition-colors',
                      isHidden ? 'opacity-40 hover:opacity-70' : 'hover:bg-slate-700/50'
                    )}
                  >
                    <div
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: isHidden ? '#475569' : signalColor }}
                    />
                    <span className="text-[10px] text-slate-300 flex-1">{config.shortName}</span>
                    <span className="text-[9px] text-slate-500">{config.layer === 'decision-maker' ? 'DM' : config.layer === 'safety-net' ? 'SN' : 'SUP'}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Sortable compass widgets */}
      <div className="flex-1 overflow-x-auto overflow-y-visible scrollbar-thin">
        <DndContext
          id={dndId}
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={filteredOrder} strategy={horizontalListSortingStrategy}>
            <div className="flex items-stretch gap-0 min-w-max">
              {filteredOrder.map((id) => {
                const config = configMap.get(id);
                if (!config) return null;
                const state = compassStates.get(id);
                return (
                  <CompassWidget key={id} config={config} state={state ?? null} />
                );
              })}
            </div>
          </SortableContext>

          {/* Drag overlay for smooth visual feedback */}
          <DragOverlay>
            {activeDragId && activeConfig && activeState && (
              <div className="flex items-center gap-1.5 px-2 py-1.5 bg-slate-800 border border-blue-500/50 rounded-md shadow-lg opacity-90">
                <div
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: SIGNAL_COLORS[activeState.signal] }}
                />
                <span className="text-[10px] font-medium text-slate-300 whitespace-nowrap">
                  {activeConfig.shortName}
                </span>
                <span
                  className="text-[10px] font-mono"
                  style={{ color: SIGNAL_COLORS[activeState.signal] }}
                >
                  {activeState.value > 0 ? '+' : ''}{activeState.value.toFixed(0)}
                </span>
              </div>
            )}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
}
