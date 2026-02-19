'use client';

import { useState, useEffect, useMemo, useCallback, useId } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useWatchlistStore } from '@/stores/useWatchlistStore';
import { useDetachable } from '@/hooks/useDetachable';
import { useBroadcastChannel } from '@/hooks/useBroadcastChannel';
import { WatchlistSearch } from './WatchlistSearch';
import { WatchlistGroupSection } from './WatchlistGroup';
import { NotificationSettings } from './NotificationSettings';
import { cn } from '@/lib/utils';
import { type WatchlistGroup } from '@/data/types/watchlist';

function SortableGroup({ group, isActive }: { group: WatchlistGroup; isActive: boolean }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: group.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className={cn(isDragging && 'opacity-50 z-50')} {...attributes}>
      <WatchlistGroupSection
        group={group}
        isActive={isActive}
        dragListeners={listeners}
      />
    </div>
  );
}

export function WatchlistPanel({ standalone = false }: { standalone?: boolean }) {
  const dndId = useId();
  const {
    groups,
    activeGroupId,
    filterGroupId,
    isDetached,
    setFilterGroup,
    setDetached,
  } = useWatchlistStore();
  const createGroup = useWatchlistStore((s) => s.createGroup);
  const reorderGroups = useWatchlistStore((s) => s.reorderGroups);
  const loadWatchlists = useWatchlistStore((s) => s.loadWatchlists);
  const { detach } = useDetachable('watchlist');

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleGroupDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;
      const oldIndex = groups.findIndex((g) => g.id === active.id);
      const newIndex = groups.findIndex((g) => g.id === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        reorderGroups(oldIndex, newIndex);
      }
    },
    [groups, reorderGroups]
  );

  const [showNewGroup, setShowNewGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [showNotifSettings, setShowNotifSettings] = useState(false);

  // Load from storage on mount
  useEffect(() => {
    loadWatchlists();
  }, [loadWatchlists]);

  // Broadcast channel sync
  useBroadcastChannel<{ type: string }>('watchlist', (payload) => {
    if (payload.type === 'subscription-changed') {
      // The store will be updated via the broadcast
    }
  });

  const filteredGroups = useMemo(() => {
    if (!filterGroupId) return groups;
    return groups.filter((g) => g.id === filterGroupId);
  }, [groups, filterGroupId]);

  const handleCreateGroup = () => {
    if (newGroupName.trim()) {
      createGroup(newGroupName.trim());
      setNewGroupName('');
      setShowNewGroup(false);
    }
  };

  const handleDetach = () => {
    setDetached(true);
    detach();
  };

  // In standalone (detached window) mode, always show content
  // In main window mode, show placeholder when detached
  if (isDetached && !standalone) {
    return null;
  }

  return (
    <div className="h-full flex flex-col bg-[#131313]">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-black shrink-0">
        <span className="text-xs font-semibold text-[#999999] uppercase tracking-wider">
          Watchlists
        </span>
        <div className="flex items-center gap-1">
          {/* Add new watchlist */}
          <button
            onClick={() => setShowNewGroup(!showNewGroup)}
            className="p-1 text-[#777777] hover:text-[#AB9FF2] transition-colors"
            title="New watchlist"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M8 2v12M2 8h12" />
            </svg>
          </button>
          {/* Notification settings */}
          <button
            onClick={() => setShowNotifSettings(!showNotifSettings)}
            className={cn(
              'p-1 transition-colors',
              showNotifSettings
                ? 'text-[#CD8554] hover:text-[#CD8554]'
                : 'text-[#777777] hover:text-[#CD8554]'
            )}
            title="Notification settings"
          >
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M8 1a1 1 0 011 1v.5A4.5 4.5 0 0112.5 7v3l1.5 2H2l1.5-2V7A4.5 4.5 0 017 2.5V2a1 1 0 011-1zM6 13a2 2 0 004 0H6z" />
            </svg>
          </button>
          {/* Detach button - only shown in main window */}
          {!standalone && (
            <button
              onClick={handleDetach}
              className="p-1 text-[#777777] hover:text-[#999999] transition-colors"
              title="Open in new window"
            >
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 1h6v6M15 1L8 8M6 3H2v11h11v-4" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* New group input */}
      {showNewGroup && (
        <div className="px-2 py-2 border-b border-black flex items-center gap-1">
          <input
            autoFocus
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleCreateGroup();
              if (e.key === 'Escape') setShowNewGroup(false);
            }}
            placeholder="Watchlist name..."
            className="flex-1 bg-white/[0.06] border border-black rounded px-2 py-1 text-xs text-white placeholder:text-[#777777] focus:outline-none focus:ring-1 focus:ring-[#AB9FF2]"
          />
          <button
            onClick={handleCreateGroup}
            className="px-2 py-1 text-xs bg-[#AB9FF2] hover:brightness-110 text-white rounded transition-colors"
          >
            Add
          </button>
        </div>
      )}

      {/* Search */}
      <div className="py-2 border-b border-black shrink-0">
        <WatchlistSearch />
      </div>

      {/* Filter tabs: All / specific groups */}
      <div className="flex items-center gap-1 px-2 py-1.5 border-b border-black overflow-x-auto shrink-0">
        <button
          onClick={() => setFilterGroup(null)}
          className={cn(
            'px-2 py-0.5 text-[10px] rounded-full border whitespace-nowrap transition-colors',
            !filterGroupId
              ? 'border-[#AB9FF2] text-[#AB9FF2]'
              : 'border-black text-[#777777] hover:text-[#999999]'
          )}
        >
          All
        </button>
        {groups.map((group) => (
          <button
            key={group.id}
            onClick={() => setFilterGroup(filterGroupId === group.id ? null : group.id)}
            className={cn(
              'px-2 py-0.5 text-[10px] rounded-full border whitespace-nowrap transition-colors',
              filterGroupId === group.id
                ? 'border-current'
                : 'border-black text-[#777777]'
            )}
            style={
              filterGroupId === group.id
                ? { borderColor: group.color, color: group.color }
                : undefined
            }
          >
            {group.name}
          </button>
        ))}
      </div>

      {/* Group sections (scrollable, drag-and-drop reorderable) */}
      <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
        {filteredGroups.length === 0 ? (
          <div className="px-3 py-8 text-center text-xs text-[#999999]">
            No watchlists yet. Click + to create one.
          </div>
        ) : (
          <DndContext
            id={dndId}
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleGroupDragEnd}
          >
            <SortableContext
              items={filteredGroups.map((g) => g.id)}
              strategy={verticalListSortingStrategy}
            >
              {filteredGroups.map((group) => (
                <SortableGroup
                  key={group.id}
                  group={group}
                  isActive={activeGroupId === group.id}
                />
              ))}
            </SortableContext>
          </DndContext>
        )}
      </div>

      {/* Notification settings panel */}
      {showNotifSettings && (
        <NotificationSettings onClose={() => setShowNotifSettings(false)} />
      )}

      {/* Footer */}
      <div className="px-3 py-1.5 border-t border-black shrink-0">
        <span className="text-[10px] text-[#999999]">
          {groups.length}/10 watchlists | {groups.reduce((a, g) => a + g.items.length, 0)} items
        </span>
      </div>
    </div>
  );
}
