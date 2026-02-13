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
        const store = useOnionStore.getState();
        store.resetDrill();
        if (msg.drillPath) {
          for (const segment of msg.drillPath) {
            useOnionStore.getState().drillDown(segment);
          }
        }
      }
    });

    const unsubWatchlist = subscribeToSync('watchlist', (payload) => {
      const msg = payload as { type: string };
      if (msg.type === 'reload-groups') {
        useWatchlistStore.getState().loadWatchlists();
      }
    });

    const unsubNews = subscribeToSync('news', (payload) => {
      const msg = payload as {
        type: string;
        tickers?: string[];
        sectors?: string[];
      };
      if (msg.type === 'context-update' && msg.tickers && msg.sectors) {
        useNewsStore.getState().setLookingAtContext(msg.tickers, msg.sectors);
      }
    });

    return () => {
      unsubDetails();
      unsubOnion();
      unsubWatchlist();
      unsubNews();
    };
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
