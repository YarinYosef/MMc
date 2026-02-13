'use client';

import { useEffect } from 'react';
import { useNewsStore } from '@/stores/useNewsStore';
import { useOnionStore } from '@/stores/useOnionStore';
import { useWatchlistStore } from '@/stores/useWatchlistStore';
import { useDetachable } from '@/hooks/useDetachable';
import { useBroadcastChannel } from '@/hooks/useBroadcastChannel';
import { TooltipProvider } from '@/components/ui/Tooltip';
import { NewsFeedColumn } from './NewsFeedColumn';
import { cn } from '@/lib/utils';

export function NewsFeed() {
  const { feeds, items, autoScroll, isDetached } = useNewsStore();
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
    setSubscribedSymbols(getSubscribedSymbols());
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

  if (isDetached) {
    return (
      <div className="h-full flex items-center justify-center bg-slate-950 text-slate-500 text-xs">
        News feed is detached. Click to reattach.
      </div>
    );
  }

  return (
    <TooltipProvider delayDuration={300}>
      <div className="h-full flex flex-col bg-slate-950 font-mono">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-2 py-0.5 border-b border-slate-800 shrink-0 bg-slate-900/50">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">
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
                  ? 'bg-blue-500/20 text-blue-400'
                  : 'bg-slate-800 text-slate-500 hover:text-slate-400'
              )}
              title={autoScroll ? 'Auto-scroll: ON' : 'Auto-scroll: OFF'}
            >
              AUTO
            </button>
            {/* Full-screen / Detach button */}
            <button
              onClick={handleDetach}
              className="px-1.5 py-0.5 text-[9px] bg-slate-800 text-slate-500 hover:text-slate-300 rounded transition-colors"
              title="Open in new window"
            >
              <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 1h6v6M15 1L8 8M6 3H2v11h11v-4" />
              </svg>
            </button>
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
    </TooltipProvider>
  );
}
