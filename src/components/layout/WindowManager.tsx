'use client';

import { useEffect, useRef } from 'react';
import { useLayoutStore } from '@/stores/useLayoutStore';
import { useDetailsStore } from '@/stores/useDetailsStore';
import { useOnionStore } from '@/stores/useOnionStore';
import { useNewsStore } from '@/stores/useNewsStore';
import { useWatchlistStore } from '@/stores/useWatchlistStore';
import {
  broadcastStateUpdate,
  subscribeToSync,
  closeSyncChannel,
} from '@/lib/syncEngine';
import { getWindowRefs } from '@/hooks/useWindowManager';

export function WindowManager() {
  const windows = useLayoutStore((s) => s.windows);
  const closeWindow = useLayoutStore((s) => s.closeWindow);
  const closeWindowRef = useRef(closeWindow);
  useEffect(() => {
    closeWindowRef.current = closeWindow;
  }, [closeWindow]);

  // --- Broadcast state changes to detached windows ---
  useEffect(() => {
    // When selectedSymbol changes, broadcast to all windows
    const unsubDetails = useDetailsStore.subscribe((state, prev) => {
      if (state.selectedSymbol !== prev.selectedSymbol) {
        broadcastStateUpdate('details', {
          type: 'symbol-changed',
          symbol: state.selectedSymbol,
        });
      }
    });

    // When onion drillPath or selectedSegment changes, broadcast
    const unsubOnion = useOnionStore.subscribe((state, prev) => {
      if (
        state.drillPath !== prev.drillPath ||
        state.selectedSegment !== prev.selectedSegment
      ) {
        broadcastStateUpdate('onion', {
          type: 'drill-changed',
          drillPath: state.drillPath,
          selectedSegment: state.selectedSegment,
        });
      }
    });

    return () => {
      unsubDetails();
      unsubOnion();
    };
  }, []);

  // --- Receive state from detached windows ---
  useEffect(() => {
    const unsubDetails = subscribeToSync('details', (payload) => {
      const msg = payload as { type: string; symbol?: string | null };
      if (msg.type === 'symbol-changed' && msg.symbol !== undefined) {
        useDetailsStore.getState().setSelectedSymbol(msg.symbol);
      }
    });

    const unsubOnion = subscribeToSync('onion', (payload) => {
      const msg = payload as {
        type: string;
        drillPath?: string[];
        selectedSegment?: string | null;
      };
      if (msg.type === 'drill-changed') {
        if (msg.drillPath && msg.drillPath.length > 0) {
          useOnionStore.getState().setDrillPath(msg.drillPath);
        } else {
          useOnionStore.getState().resetDrill();
        }
      }
    });

    const unsubWatchlist = subscribeToSync('watchlist', (payload) => {
      const msg = payload as { type: string };
      if (msg.type === 'reload-groups') {
        useWatchlistStore.getState().loadWatchlists();
      }
      // Also re-sync subscriptions when detached watchlist changes subscriptions
      if (msg.type === 'subscription-changed' || msg.type === 'group-deleted') {
        const symbols = useWatchlistStore.getState().getSubscribedSymbols();
        useNewsStore.getState().setSubscribedSymbols(symbols);
      }
    });

    const unsubNews = subscribeToSync('news', (payload) => {
      const msg = payload as {
        type: string;
        tickers?: string[];
        sectors?: string[];
        feedType?: any;
        item?: any;
      };
      if (msg.type === 'context-update' && msg.tickers && msg.sectors) {
        useNewsStore.getState().setLookingAtContext(msg.tickers, msg.sectors);
      } else if (msg.type === 'new-item' && msg.feedType && msg.item) {
        const { feedType, item } = msg;
        // Add the item to the store without re-broadcasting
        useNewsStore.setState((prev) => {
          const feedItems = prev.items[feedType as keyof typeof prev.items] || [];
          if (feedItems.some((i: any) => i.id === item.id)) return prev;
          const updatedFeed = [item, ...feedItems].slice(0, 200);
          return { items: { ...prev.items, [feedType]: updatedFeed } };
        });
      } else if (msg.type === 'request-full-sync') {
        // Detached window is requesting all existing news items
        const newsItems = useNewsStore.getState().items;
        broadcastStateUpdate('news', { type: 'full-sync', items: newsItems });
      }
    });

    return () => {
      unsubDetails();
      unsubOnion();
      unsubWatchlist();
      unsubNews();
    };
  }, []);

  // --- Sync watchlist subscriptions → news store ---
  useEffect(() => {
    const syncSubscriptions = () => {
      const symbols = useWatchlistStore.getState().getSubscribedSymbols();
      useNewsStore.getState().setSubscribedSymbols(symbols);
    };

    // Initial sync
    syncSubscriptions();

    // Re-sync whenever watchlist state changes
    const unsub = useWatchlistStore.subscribe(() => syncSubscriptions());

    return unsub;
  }, []);

  // --- Monitor detached windows for closure (fallback check) ---
  useEffect(() => {
    const refs = getWindowRefs();
    const checkWindows = setInterval(() => {
      for (const win of windows) {
        if (win.isOpen && win.type.startsWith('detached-')) {
          const ref = refs.get(win.id);
          if (ref && ref.closed) {
            closeWindowRef.current(win.id);
            refs.delete(win.id);

            if (win.type === 'detached-news') {
              useNewsStore.getState().setDetached(false);
            } else if (win.type === 'detached-watchlist') {
              useWatchlistStore.getState().setDetached(false);
            }
          }
        }
      }
    }, 2000);

    return () => clearInterval(checkWindows);
  }, [windows]);

  // --- Cleanup on unmount ---
  useEffect(() => {
    return () => {
      closeSyncChannel();
      const refs = getWindowRefs();
      for (const [, ref] of refs) {
        try {
          ref.close();
        } catch {
          // Window may already be closed
        }
      }
      refs.clear();
    };
  }, []);

  return null; // Logic-only component
}
