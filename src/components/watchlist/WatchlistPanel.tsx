'use client';

import { useState, useEffect, useMemo } from 'react';
import { useWatchlistStore } from '@/stores/useWatchlistStore';
import { useDetachable } from '@/hooks/useDetachable';
import { useBroadcastChannel } from '@/hooks/useBroadcastChannel';
import { ScrollArea } from '@/components/ui/ScrollArea';
import { WatchlistSearch } from './WatchlistSearch';
import { WatchlistGroupSection } from './WatchlistGroup';
import { NotificationSettings } from './NotificationSettings';
import { cn } from '@/lib/utils';

export function WatchlistPanel() {
  const {
    groups,
    activeGroupId,
    filterGroupId,
    isDetached,
    setFilterGroup,
    setDetached,
  } = useWatchlistStore();
  const createGroup = useWatchlistStore((s) => s.createGroup);
  const loadWatchlists = useWatchlistStore((s) => s.loadWatchlists);
  const { detach } = useDetachable('watchlist');

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

  if (isDetached) {
    return (
      <div className="h-full flex items-center justify-center bg-slate-900 text-slate-500 text-xs">
        Watchlist detached
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-slate-900">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-slate-800 shrink-0">
        <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
          Watchlists
        </span>
        <div className="flex items-center gap-1">
          {/* Add new watchlist */}
          <button
            onClick={() => setShowNewGroup(!showNewGroup)}
            className="p-1 text-slate-500 hover:text-blue-400 transition-colors"
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
                ? 'text-yellow-400 hover:text-yellow-300'
                : 'text-slate-500 hover:text-yellow-400'
            )}
            title="Notification settings"
          >
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M8 1a1 1 0 011 1v.5A4.5 4.5 0 0112.5 7v3l1.5 2H2l1.5-2V7A4.5 4.5 0 017 2.5V2a1 1 0 011-1zM6 13a2 2 0 004 0H6z" />
            </svg>
          </button>
          {/* Detach button */}
          <button
            onClick={handleDetach}
            className="p-1 text-slate-500 hover:text-slate-300 transition-colors"
            title="Open in new window"
          >
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 1h6v6M15 1L8 8M6 3H2v11h11v-4" />
            </svg>
          </button>
        </div>
      </div>

      {/* New group input */}
      {showNewGroup && (
        <div className="px-2 py-2 border-b border-slate-800 flex items-center gap-1">
          <input
            autoFocus
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleCreateGroup();
              if (e.key === 'Escape') setShowNewGroup(false);
            }}
            placeholder="Watchlist name..."
            className="flex-1 bg-slate-800 border border-slate-700 rounded px-2 py-1 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <button
            onClick={handleCreateGroup}
            className="px-2 py-1 text-xs bg-blue-600 hover:bg-blue-500 text-white rounded transition-colors"
          >
            Add
          </button>
        </div>
      )}

      {/* Search */}
      <div className="py-2 border-b border-slate-800 shrink-0">
        <WatchlistSearch />
      </div>

      {/* Filter tabs: All / specific groups */}
      <div className="flex items-center gap-1 px-2 py-1.5 border-b border-slate-800 overflow-x-auto shrink-0">
        <button
          onClick={() => setFilterGroup(null)}
          className={cn(
            'px-2 py-0.5 text-[10px] rounded-full border whitespace-nowrap transition-colors',
            !filterGroupId
              ? 'border-blue-500 text-blue-400'
              : 'border-slate-700 text-slate-500 hover:text-slate-400'
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
                : 'border-slate-700 text-slate-500'
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

      {/* Group sections (scrollable) */}
      <ScrollArea className="flex-1">
        <div>
          {filteredGroups.length === 0 ? (
            <div className="px-3 py-8 text-center text-xs text-slate-600">
              No watchlists yet. Click + to create one.
            </div>
          ) : (
            filteredGroups.map((group) => (
              <WatchlistGroupSection
                key={group.id}
                group={group}
                isActive={activeGroupId === group.id}
              />
            ))
          )}
        </div>
      </ScrollArea>

      {/* Notification settings panel */}
      {showNotifSettings && (
        <NotificationSettings onClose={() => setShowNotifSettings(false)} />
      )}

      {/* Footer */}
      <div className="px-3 py-1.5 border-t border-slate-800 shrink-0">
        <span className="text-[9px] text-slate-600">
          {groups.length}/10 watchlists | {groups.reduce((a, g) => a + g.items.length, 0)} items
        </span>
      </div>
    </div>
  );
}
