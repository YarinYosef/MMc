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

export function CompassBar() {
  const dndId = useId();
  const { compassStates, barState } = useCompassStore();
  const { order, hidden, expanded } = barState;
  const reorderCompasses = useCompassStore((s) => s.reorderCompasses);
  const setExpanded = useCompassStore((s) => s.setExpanded);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [activeDragId, setActiveDragId] = useState<CompassId | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor)
  );

  // Show all compasses that aren't hidden (no layer filter - managed in Layout Manager)
  const filteredOrder = useMemo(() => {
    return order.filter((id) => !hidden.has(id));
  }, [order, hidden]);

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

  // Convert vertical mouse wheel to horizontal scroll in compass bar
  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const handler = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        el.scrollLeft += e.deltaY;
      }
    };
    el.addEventListener('wheel', handler, { passive: false });
    return () => el.removeEventListener('wheel', handler);
  }, []);

  const activeConfig = activeDragId ? configMap.get(activeDragId) : null;
  const activeState = activeDragId ? compassStates.get(activeDragId) : null;

  return (
    <div className="flex items-stretch gap-0 bg-[#131313]/95 backdrop-blur-sm">
      {/* Sortable compass widgets - scrollbar hidden but scrollable */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-x-auto overflow-y-visible"
        style={{ scrollbarWidth: 'none' }}
      >
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
              <div className="flex items-center gap-1.5 px-3 py-2.5 bg-white/[0.06] border border-[#AB9FF2]/50 rounded-md shadow-lg opacity-90">
                <div
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: SIGNAL_COLORS[activeState.signal] }}
                />
                <span className="text-xs font-medium text-[#999999] whitespace-nowrap">
                  {activeConfig.shortName}
                </span>
                <span
                  className="text-xs font-mono"
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
