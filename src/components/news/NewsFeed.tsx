'use client';

import { useEffect } from 'react';
import { useNewsStore } from '@/stores/useNewsStore';
import { useOnionStore } from '@/stores/useOnionStore';
import { useWatchlistStore } from '@/stores/useWatchlistStore';
import { useDetachable } from '@/hooks/useDetachable';
import { useBroadcastChannel } from '@/hooks/useBroadcastChannel';
import { NewsFeedColumn } from './NewsFeedColumn';
import { cn } from '@/lib/utils';

export function NewsFeed({ standalone = false }: { standalone?: boolean }) {
  const feeds = useNewsStore((s) => s.feeds);
  const items = useNewsStore((s) => s.items);
  const autoScroll = useNewsStore((s) => s.autoScroll);
  const isDetached = useNewsStore((s) => s.isDetached);
  const toggleAutoScroll = useNewsStore((s) => s.toggleAutoScroll);
  const setDetached = useNewsStore((s) => s.setDetached);
  const setLookingAtContext = useNewsStore((s) => s.setLookingAtContext);
  const setSubscribedSymbols = useNewsStore((s) => s.setSubscribedSymbols);
  const { detach } = useDetachable('news');

  // Sync with Onion selection for "Looking At" feed
  const selectedSegment = useOnionStore((s) => s.selectedSegment);
  useEffect(() => {
    if (selectedSegment) {
      setLookingAtContext([selectedSegment], []);
    }
  }, [selectedSegment, setLookingAtContext]);

  // Sync with watchlist subscribed symbols
  const getSubscribedSymbols = useWatchlistStore((s) => s.getSubscribedSymbols);
  const groups = useWatchlistStore((s) => s.groups);
  useEffect(() => {
    const next = getSubscribedSymbols();
    const prev = useNewsStore.getState().subscribedSymbols;
    if (
      next.length !== prev.length ||
      next.some((s, i) => s !== prev[i])
    ) {
      setSubscribedSymbols(next);
    }
  }, [groups, getSubscribedSymbols, setSubscribedSymbols]);

  // Listen for broadcast sync
  useBroadcastChannel<{ type: string }>('news', (payload) => {
    if (payload.type === 'detach-state') {
      // Handle sync from detached window
    }
  });

  const handleDetach = () => {
    setDetached(true);
    detach();
  };

  // When detached, the main DashboardLayout hides this panel entirely to make space
  if (isDetached && !standalone) {
    return null;
  }

  return (
    <div className="h-full flex flex-col bg-black font-mono">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-2.5 py-1 border-b border-black shrink-0 bg-[#131313]/60">
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-[#888888] uppercase tracking-wider font-semibold">
              News Terminal
            </span>
          </div>
          <div className="flex items-center gap-1">
            {/* Auto-scroll toggle */}
            <button
              onClick={toggleAutoScroll}
              className={cn(
                'px-1.5 py-0.5 text-[9px] rounded transition-colors',
                autoScroll
                  ? 'bg-[#AB9FF2]/20 text-[#AB9FF2]'
                  : 'bg-white/[0.06] text-[#777777] hover:text-[#999999]'
              )}
              title={autoScroll ? 'Auto-scroll: ON' : 'Auto-scroll: OFF'}
            >
              AUTO
            </button>
            {/* Detach button - only shown in main window */}
            {!standalone && (
              <button
                onClick={handleDetach}
                className="px-1.5 py-0.5 text-[9px] bg-white/[0.06] text-[#777777] hover:text-[#999999] rounded transition-colors"
                title="Open in new window"
              >
                <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 1h6v6M15 1L8 8M6 3H2v11h11v-4" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* 4 Feed Columns side by side */}
        <div className="flex-1 flex overflow-hidden">
          {feeds.map((feed) => (
            <NewsFeedColumn
              key={feed.id}
              feed={feed}
              items={items[feed.type] ?? []}
            />
          ))}
        </div>
    </div>
  );
}
