'use client';

import { useEffect, useRef } from 'react';
import { useMarketStore } from '@/stores/useMarketStore';
import { useCompassStore } from '@/stores/useCompassStore';
import { useBroadcastChannel } from '@/hooks/useBroadcastChannel';
import { useNewsStore } from '@/stores/useNewsStore';
import { useDetailsStore } from '@/stores/useDetailsStore';
import { broadcastStateUpdate } from '@/lib/syncEngine';
import { type NewsItem, type NewsFeedType } from '@/data/types/news';
import { NewsFeed } from '@/components/news/NewsFeed';

export default function DetachedNewsPage() {
  // Start market engine and compass for ticker data, but NOT news feed
  const startEngine = useMarketStore((s) => s.startEngine);
  const stopEngine = useMarketStore((s) => s.stopEngine);
  const startCompass = useCompassStore((s) => s.startUpdates);
  const stopCompass = useCompassStore((s) => s.stopUpdates);

  useEffect(() => {
    startEngine();
    startCompass();
    return () => {
      stopEngine();
      stopCompass();
    };
  }, [startEngine, stopEngine, startCompass, stopCompass]);

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
      const tickers: string[] = [];
      const sectors: string[] = [];
      for (const segment of msg.drillPath) {
        if (segment === segment.toUpperCase() && segment.length <= 5) {
          tickers.push(segment);
        } else {
          sectors.push(segment);
        }
      }
      useNewsStore.getState().setLookingAtContext(tickers, sectors);
    }
  });

  // Receive news items from main window (full sync + individual new items)
  useBroadcastChannel<{
    type: string;
    items?: Record<NewsFeedType, NewsItem[]>;
    feedType?: NewsFeedType;
    item?: NewsItem;
  }>('news', (msg) => {
    if (msg.type === 'full-sync' && msg.items) {
      useNewsStore.setState({ items: msg.items });
      lastSyncRef.current = Date.now();
    } else if (msg.type === 'new-item' && msg.feedType && msg.item) {
      const { feedType, item } = msg;
      useNewsStore.setState((prev) => {
        const feedItems = prev.items[feedType] || [];
        if (feedItems.some((i) => i.id === item.id)) return prev;
        const updatedFeed = [item, ...feedItems].slice(0, 200);
        return { items: { ...prev.items, [feedType]: updatedFeed } };
      });
      lastSyncRef.current = Date.now();
    }
  });

  const lastSyncRef = useRef(0);

  useEffect(() => {
    // Mark as detached and ensure no local news generation
    useNewsStore.getState().setDetached(true);
    useNewsStore.getState().stopNewsFeed();

    // Request a full sync from the main window
    broadcastStateUpdate('news', { type: 'request-full-sync' });

    // Periodic full-sync polling as fallback in case individual broadcasts are missed
    const syncInterval = setInterval(() => {
      const elapsed = Date.now() - lastSyncRef.current;
      // If no update received in 15 seconds, request a full re-sync
      if (elapsed > 15000) {
        broadcastStateUpdate('news', { type: 'request-full-sync' });
      }
    }, 10000);

    const handleBeforeUnload = () => {
      useNewsStore.getState().setDetached(false);
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      clearInterval(syncInterval);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  return (
    <div className="h-screen w-screen bg-black flex flex-col font-mono text-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-black bg-[#131313]/50 shrink-0">
        <span className="text-sm font-bold text-[#AB9FF2] tracking-wider">
          MMC NEWS TERMINAL
        </span>
        <span className="text-[10px] text-[#777777]">Detached Window</span>
      </div>

      <div className="flex-1 overflow-hidden">
        <NewsFeed standalone />
      </div>
    </div>
  );
}
