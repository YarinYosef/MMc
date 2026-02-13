'use client';

import { useEffect } from 'react';
import { useMarketUpdates } from '@/hooks/useMarketUpdates';
import { useBroadcastChannel } from '@/hooks/useBroadcastChannel';
import { useNewsStore } from '@/stores/useNewsStore';
import { useDetailsStore } from '@/stores/useDetailsStore';
import { TooltipProvider } from '@/components/ui/Tooltip';
import { NewsFeedColumn } from '@/components/news/NewsFeedColumn';

export default function DetachedNewsPage() {
  useMarketUpdates();

  const { feeds, items } = useNewsStore();

  // Sync details store changes from main window
  useBroadcastChannel<{ type: string; symbol?: string | null }>('details', (msg) => {
    if (msg.type === 'symbol-changed' && msg.symbol !== undefined) {
      useDetailsStore.getState().setSelectedSymbol(msg.symbol);
    }
  });

  // Sync onion drill context from main window -> update "Looking At" feed
  useBroadcastChannel<{
    type: string;
    drillPath?: string[];
    selectedSegment?: string | null;
  }>('onion', (msg) => {
    if (msg.type === 'drill-changed' && msg.drillPath) {
      // Update the looking-at context based on drill path
      const tickers: string[] = [];
      const sectors: string[] = [];
      for (const segment of msg.drillPath) {
        // Simple heuristic: uppercase short strings are tickers, others are sectors
        if (segment === segment.toUpperCase() && segment.length <= 5) {
          tickers.push(segment);
        } else {
          sectors.push(segment);
        }
      }
      useNewsStore.getState().setLookingAtContext(tickers, sectors);
    }
  });

  // Sync news context from main window
  useBroadcastChannel<{ type: string; tickers?: string[]; sectors?: string[] }>(
    'news',
    (msg) => {
      if (msg.type === 'context-update' && msg.tickers && msg.sectors) {
        useNewsStore.getState().setLookingAtContext(msg.tickers, msg.sectors);
      }
    }
  );

  // Start news feed and notify main window on close
  useEffect(() => {
    const newsStore = useNewsStore.getState();
    newsStore.setDetached(true);
    newsStore.startNewsFeed();

    const handleBeforeUnload = () => {
      useNewsStore.getState().setDetached(false);
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      useNewsStore.getState().stopNewsFeed();
    };
  }, []);

  return (
    <TooltipProvider delayDuration={300}>
      <div className="h-screen w-screen bg-slate-950 flex flex-col font-mono text-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800 bg-slate-900/50 shrink-0">
          <span className="text-sm font-bold text-blue-400 tracking-wider">
            MMC NEWS TERMINAL
          </span>
          <span className="text-[10px] text-slate-500">Detached Window</span>
        </div>

        {/* 4 Feed columns */}
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
